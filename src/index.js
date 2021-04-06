import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: cyan,
    },
});
TimeAgo.addDefaultLocale(en);
ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
