export class Trades {
    constructor(maxLength) {
        this._maxLength = maxLength;
        this._trades = [];
    }
    get trades() {
        return this._trades;
    }
    get lastTrade() {
        if (this._trades.length > 0) {
            return this._trades[0];
        } else return null;
    }
    initTrades(trades) {
        this._trades = trades;
    }
    newTrade(trade) {
        if (this._trades.length >= this._maxLength) {
            this._trades.pop();
        }
        this._trades.unshift(trade);
    }
}
export class Orderbook {
    constructor() {
        this._bids = [];
        this._asks = [];
    }
    get bids() {
        return this._bids.slice();
    }
    get asks() {
        return this._asks.slice();
    }
    get bestBid() {
        return this._bids[this._bids.length - 1];
    }
    get bestAsk() {
        return this._asks[this._asks.length - 1];
    }
    changeBid(newBid) {
        if (newBid.qty == 0) {
            for (let i = this._bids.length - 1; i >= 0; i--) {
                if (this._bids[i].price === newBid.price) {
                    this._bids.splice(i, 1);
                    return;
                }
            }
        } else if (
            this._bids.length < 1 ||
            newBid.price < this._bids[0].price
        ) {
            this._bids.unshift(newBid);
        } else {
            for (let i = this._bids.length - 1; i >= 0; i--) {
                if (this._bids[i].price == newBid.price) {
                    this._bids[i].qty = newBid.qty;
                    return;
                }
                if (this._bids[i].price < newBid.price) {
                    this._bids.splice(i + 1, 0, newBid);
                    return;
                }
            }
        }
    }
    changeAsk(newAsk) {
        if (newAsk.qty == 0) {
            for (let i = this._asks.length - 1; i >= 0; i--) {
                if (this._asks[i].price === newAsk.price) {
                    this._asks.splice(i, 1);
                    return;
                }
            }
        } else if (
            this._asks.length < 1 ||
            newAsk.price > this._asks[0].price
        ) {
            this._asks.unshift(newAsk);
        } else {
            for (let i = this._asks.length - 1; i >= 0; i--) {
                if (this._asks[i].price == newAsk.price) {
                    this._asks[i].qty = newAsk.qty;
                    return;
                }
                if (this._asks[i].price > newAsk.price) {
                    this._asks.splice(i + 1, 0, newAsk);
                    return;
                }
            }
        }
    }
}
