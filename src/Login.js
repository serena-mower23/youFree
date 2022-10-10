import React from "react";

class Login extends React.Component {
    render() {
        return (
            <div>
                <div class="container mt-5 d-flex flex-column align-items-center">
                    <h1>youFree?</h1>
                    <p>Please log in to create and manage your calendars.</p>
                    <form class="needs-validation" action="/login" method="POST" novalidate>
                        <div class="mb-3">
                            <label class="form-label" for="username">Username:</label>
                            <input class="form-control" type="text" name="username" id="username" required/>
                            <div class="invalid-feedback">Please provide a username.</div> 
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="password">Password:</label>
                            <input class="form-control" type="password" name="password" id="password" required/>
                            <div class="invalid-feedback">Please provide a password.</div> 
                        </div>
                        <div class="d-grid d-sm-block text-center">
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;
