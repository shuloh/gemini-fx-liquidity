import {
    Box,
    Paper,
    Typography,
    Button,
    Container,
    Grid,
} from "@material-ui/core";
import "./App.css";
import React, { useRef, useEffect, useReducer, useState } from "react";
import WsWorker from "worker-loader!./wsworker.js"; // eslint-disable-line import/no-webpack-loader-syntax
import LastTrade from "./LastTrade";
import Liquidity from "./Liquidity";
import { useTheme } from "@material-ui/core/styles";
function App() {
    const theme = useTheme();
    const wsworker = useRef(null);
    useEffect(() => {
        wsworker.current = new WsWorker();
        wsworker.current.onmessage = (e) => {
            const r = e.data;
            if (r.type === "initialized") {
                setInitialized(r.data);
            } else if (r.symbol === "BTCUSD" && r.type === "trade") {
                btcusdTradeDispatch(r.data);
            } else if (r.symbol === "BTCSGD" && r.type === "trade") {
                btcsgdTradeDispatch(r.data);
            } else if (r.type === "liquidity") {
                setLiquidity(r.data);
            }
        };
    }, [wsworker]);
    const [initialized, setInitialized] = useState(false);
    const [liquidity, setLiquidity] = useState([]);
    const [btcusdTrade, btcusdTradeDispatch] = useReducer(tradeReducer, null);
    const [btcsgdTrade, btcsgdTradeDispatch] = useReducer(tradeReducer, null);
    function calculateLiquidity(btc) {
        wsworker.current.postMessage({
            action: "liquidity",
            exch: "gemini",
            btc: btc,
        });
    }
    function tradeReducer(state, action) {
        const oldprice = state?.price ?? 0;
        const r = {
            symbol: action.symbol,
            price: Number(action.price),
            qty: Number(action.quantity),
            date: new Date(action.timestamp),
            color:
                Number(action.price) > oldprice
                    ? theme.palette.success.dark
                    : Number(action.price) < oldprice
                    ? theme.palette.error.dark
                    : theme.palette.text,
        };
        return r;
    }
    return (
        <Container maxWidth="sm" className="App">
            <Box p={2}>
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="stretch"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={(e) => {
                                wsworker.current.postMessage({
                                    action: "connect",
                                    exch: "gemini",
                                });
                            }}
                        >
                            Connect Gemini
                        </Button>
                    </Grid>
                    {initialized && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Paper elevation={4}>
                                    <Box p={2}>
                                        <Grid
                                            container
                                            justify="flex-start"
                                            alignItems="baseline"
                                            spacing={1}
                                        >
                                            <Grid item xs={12}>
                                                <Typography align="center">
                                                    Last Trade
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LastTrade
                                                    trade={btcusdTrade}
                                                ></LastTrade>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LastTrade
                                                    trade={btcsgdTrade}
                                                ></LastTrade>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    justify="flex-start"
                                                    alignItems="baseline"
                                                    spacing={1}
                                                    wrap="nowrap"
                                                >
                                                    <Grid item xs={6}>
                                                        <Typography color="textSecondary">
                                                            USD/SGD implied FX:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        zeroMinWidth
                                                    >
                                                        <Typography
                                                            color="primary"
                                                            noWrap
                                                        >
                                                            {btcsgdTrade?.price &&
                                                                btcusdTrade?.price &&
                                                                (
                                                                    btcsgdTrade.price /
                                                                    btcusdTrade.price
                                                                ).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 8,
                                                                    }
                                                                )}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={4}>
                                    <Box p={2}>
                                        <Liquidity
                                            liquidity={liquidity}
                                            calculateLiquidity={
                                                calculateLiquidity
                                            }
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid>
            </Box>
        </Container>
    );
}

export default App;
