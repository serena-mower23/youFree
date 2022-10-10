import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg mb-4">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">youFree?</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to='/Home'>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to='/Calendar'>
                                Create
                            </Link>
                        </li>
                    </ul>
                <form className="nav-item d-flex">
                    <Link className="nav-link" to='/'>
                        Log out
                    </Link>
                </form>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;