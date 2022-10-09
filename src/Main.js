import React from "react";
import { hot } from 'react-hot-loader/root';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";

class Main extends React.Component {
    render() {
      return (
          <Routes>
              <Route exact path='/'></Route>
              <Route exact path='/home' element={<Home />}></Route>
              <Route exact path='/calendar'></Route>
          </Routes>
      );
    }
}

export default Main;
