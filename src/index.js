import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import YouFreeCalendar from "./youFreeCalendar";


var mountNode = document.getElementById("app");
ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
    ), mountNode
);
