import { Grid, Typography, TextField } from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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
        <Grid item xs={12} key={o.symbol}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography color="primary">{o.symbol}</Typography>
                        </TableCell>
                        <TableCell align="right">Market Buy</TableCell>
                        <TableCell align="right">Market Sell</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Available Qty</TableCell>
                        <TableCell align="right">
                            {o.toBuy.canExecute.toLocaleString(undefined, {
                                maximumFractionDigits: 8,
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell align="right">
                            {o.toSell.canExecute.toLocaleString(undefined, {
                                maximumFractionDigits: 8,
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>VWAP (average price)</TableCell>
                        <TableCell align="right">
                            {o.toBuy.vwap.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell align="right">
                            {o.toSell.vwap.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Transaction Value</TableCell>
                        <TableCell align="right">
                            {o.toBuy.transactionVal.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell align="right">
                            {o.toSell.transactionVal.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Best Bid/Ask</TableCell>
                        <TableCell align="right">
                            {o.toBuy.bestPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell align="right">
                            {o.toSell.bestPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Worst Bid/Ask</TableCell>
                        <TableCell align="right">
                            {o.toBuy.worstPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                        <TableCell align="right">
                            {o.toSell.worstPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Grid>
    ));
    return (
        <React.Fragment>
            <Grid container alignItems="baseline" spacing={3} justify="center">
                <Grid item xs={12}>
                    <Typography>Liquidity checker</Typography>
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
                {liquidityTable}
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
