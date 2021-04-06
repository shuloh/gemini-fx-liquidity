import { Grid, Typography, TextField, Divider, Box } from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import { cyan } from "@material-ui/core/colors";
function Liquidity(props) {
    const [valBtcInput, setBtcInput] = useState(1);
    const [delay, setDelay] = useState(100);
    const [isRunning, setIsRunning] = useState(true);

    useInterval(
        () => {
            props.calculateLiquidity(valBtcInput);
        },
        isRunning ? delay : null
    );

    const liquidityTable = props.liquidity.map((o) => (
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="stretch"
            spacing={0}
            key={o.symbol}
        >
            <Grid item xs={12}>
                <Box my={2}></Box>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    spacing={1}
                >
                    <Grid item xs={4}>
                        <Typography color="primary" align="left" noWrap>
                            {o.symbol}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="right" noWrap>
                            Market Buy
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="right" noWrap>
                            Market Sell
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    spacing={1}
                >
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="left" noWrap>
                            Available Liquidity
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            color={
                                o.toBuy.canExecute < valBtcInput
                                    ? "error"
                                    : "textPrimary"
                            }
                            align="right"
                            noWrap
                        >
                            {o.toBuy.canExecute.toLocaleString(undefined, {
                                maximumFractionDigits: 8,
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            color={
                                o.toSell.canExecute < valBtcInput
                                    ? "error"
                                    : "textPrimary"
                            }
                            align="right"
                            noWrap
                        >
                            {o.toSell.canExecute.toLocaleString(undefined, {
                                maximumFractionDigits: 8,
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="baseline"
                    wrap="nowrap"
                >
                    <Grid item xs={4}>
                        <Typography
                            style={{ color: cyan[200] }}
                            align="left"
                            noWrap
                        >
                            VWAP
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            style={{ color: cyan[200] }}
                            align="right"
                            noWrap
                        >
                            {o.toBuy.vwap.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            style={{ color: cyan[200] }}
                            align="right"
                            noWrap
                        >
                            {o.toSell.vwap.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="baseline"
                    wrap="nowrap"
                >
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="left" noWrap>
                            Transaction Amt. {o.symbol.slice(-3)}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toBuy.transactionVal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toSell.transactionVal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="baseline"
                    wrap="nowrap"
                >
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="left" noWrap>
                            Best Price
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toBuy.bestPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toSell.bestPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="baseline"
                    wrap="nowrap"
                >
                    <Grid item xs={4}>
                        <Typography color="textSecondary" align="left" noWrap>
                            Worst Price
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toBuy.worstPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography align="right" noWrap>
                            {o.toSell.worstPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
        </Grid>
    ));
    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
                spacing={2}
            >
                <Grid item xs={12}>
                    <Typography>Liquidity Price checker</Typography>
                </Grid>
                <Grid item xs={12}>
                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <TextField
                            id="filled-number"
                            label="no. of BTC"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                            onChange={async (e) => {
                                if (Number(e.target.value) >= 0) {
                                    setBtcInput(e.target.value);
                                }
                            }}
                            value={valBtcInput}
                        />
                    </form>
                </Grid>
                <Grid item xs={12}>
                    {liquidityTable}
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
export default Liquidity;
