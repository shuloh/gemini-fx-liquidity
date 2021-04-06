import ReactTimeAgo from "react-time-ago";
import { Grid, Typography } from "@material-ui/core";
import React from "react";

function LastTrade(props) {
    return (
        <React.Fragment>
            {props.trade && (
                <Grid container alignItems="baseline" spacing={1} wrap="nowrap">
                    <Grid item sm={3}>
                        <Typography color="textSecondary" align="left">
                            {props.trade.symbol}
                        </Typography>
                    </Grid>

                    <Grid item sm={3}>
                        <Typography noWrap style={{ color: props.trade.color }}>
                            {props.trade.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item sm={3}>
                        <Typography noWrap>
                            {props.trade.qty.toLocaleString(undefined, {
                                minimumFractionDigits: 8,
                            })}
                        </Typography>
                    </Grid>
                    <Grid item sm={3} zeroMinWidth>
                        <Typography noWrap color="textSecondary">
                            <ReactTimeAgo
                                date={props.trade.date}
                                locale="en-US"
                            />
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
}
export default LastTrade;
