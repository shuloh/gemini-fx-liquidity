import { Orderbook, Trades } from "./Utils";
const GEMINI = "gemini";
const GEMINI_SYMBOLS = ["BTCUSD", "BTCSGD"];
const webs = new Map();
const data = new Map();
data.set(GEMINI, new Map());
GEMINI_SYMBOLS.forEach((s) => {
    data.get(GEMINI).set(s, {
        orderbook: new Orderbook(10),
        trades: new Trades(50),
    });
});

function connectWebs(exch, url) {
    webs.get(exch)?.close();
    const ws = new WebSocket(url);
    switch (exch) {
        case GEMINI:
            webs.set(GEMINI, ws);
            ws.addEventListener("close", async (e) => {
                postMessage({
                    exch: GEMINI,
                    type: "initialized",
                    data: false,
                });
            });
            ws.addEventListener("open", async (e) => {
                ws.send(
                    JSON.stringify({
                        type: "subscribe",
                        subscriptions: [
                            { name: "l2", symbols: GEMINI_SYMBOLS },
                        ],
                    })
                );
                postMessage({
                    exch: GEMINI,
                    type: "initialized",
                    data: true,
                });
            });
            ws.addEventListener("message", async (e) => {
                const jres = JSON.parse(e.data);
                switch (jres.type) {
                    case "l2_updates":
                        jres?.changes?.forEach((l) => {
                            const side = l[0];
                            const price = Number(l[1]);
                            const qty = Number(l[2]);
                            if (side === "buy") {
                                data.get(GEMINI)
                                    .get(jres.symbol)
                                    .orderbook.changeBid({
                                        price: price,
                                        qty: qty,
                                    });
                            } else if (side === "sell") {
                                data.get(GEMINI)
                                    .get(jres.symbol)
                                    .orderbook.changeAsk({
                                        price: price,
                                        qty: qty,
                                    });
                            }
                        });
                        if (jres["trades"]) {
                            data.get(GEMINI)
                                .get(jres.symbol)
                                .trades.initTrades(jres.trades);
                            postMessage({
                                exch: GEMINI,
                                symbol: jres.symbol,
                                type: "trade",
                                data: data.get(GEMINI).get(jres.symbol).trades
                                    .lastTrade,
                            });
                        }
                        break;
                    case "trade":
                        data.get(GEMINI).get(jres.symbol).trades.newTrade(jres);
                        postMessage({
                            exch: GEMINI,
                            symbol: jres.symbol,
                            type: "trade",
                            data: data.get(GEMINI).get(jres.symbol).trades
                                .lastTrade,
                        });
                        break;
                    default:
                        return;
                }
            });
            break;
        default:
            break;
    }
    return ws;
}

onmessage = async (e) => {
    switch (e.data.exch) {
        case GEMINI:
            switch (e.data.action) {
                case "connect":
                    connectWebs(GEMINI, "wss://api.gemini.com/v2/marketdata");
                    break;
                case "liquidity":
                    const r = calculateGeminiLiq(e.data.btc);
                    postMessage({
                        exch: GEMINI,
                        type: "liquidity",
                        data: r,
                    });
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
};

function calculateGeminiLiq(btc) {
    const result = [];
    GEMINI_SYMBOLS.forEach((symbol) => {
        const ob = data.get(GEMINI).get(symbol).orderbook;
        if (ob.asks.length < 1 || ob.bids.length < 1) {
            return;
        }
        const s = {
            symbol: symbol,
            toBuy: {
                remainingQty: 0,
                canExecute: 0,
                vwap: 0,
                transactionVal: 0,
                worstPrice: 0,
                bestPrice: 0,
            },
            toSell: {
                remainingQty: 0,
                canExecute: 0,
                vwap: 0,
                transactionVal: 0,
                worstPrice: 0,
                bestPrice: 0,
            },
        };
        //tosell
        {
            let _remainingQty = btc;
            let _totalReturn = 0;
            s.toSell.bestPrice = ob.bestBid.price;
            for (let i = ob.bids.length - 1; i >= 0; i--) {
                s.toSell.worstPrice = ob.bids[i].price;
                if (_remainingQty > ob.bids[i].qty) {
                    _remainingQty -= ob.bids[i].qty;
                    _totalReturn += ob.bids[i].qty * ob.bids[i].price;
                } else {
                    _totalReturn += _remainingQty * ob.bids[i].price;
                    _remainingQty = 0;
                    break;
                }
            }
            const _canExecute = btc - _remainingQty;
            s.toSell.canExecute = _canExecute;
            s.toSell.remainingQty = _remainingQty;
            s.toSell.vwap = _totalReturn / btc;
            s.toSell.transactionVal = _totalReturn;
        }
        //tobuy
        {
            let _remainingQty = btc;
            let _totalCost = 0;
            s.toBuy.bestPrice = ob.bestAsk.price;
            for (let i = ob.asks.length - 1; i >= 0; i--) {
                s.toBuy.worstPrice = ob.asks[i].price;
                if (_remainingQty > ob.asks[i].qty) {
                    _remainingQty -= ob.asks[i].qty;
                    _totalCost += ob.asks[i].qty * ob.asks[i].price;
                } else {
                    _totalCost += _remainingQty * ob.asks[i].price;
                    _remainingQty = 0;
                    break;
                }
            }
            const _canExecute = btc - _remainingQty;
            s.toBuy.canExecute = _canExecute;
            s.toBuy.remainingQty = _remainingQty;
            s.toBuy.vwap = _totalCost / btc;
            s.toBuy.transactionVal = _totalCost;
        }
        result.push(s);
    });
    return result;
}
