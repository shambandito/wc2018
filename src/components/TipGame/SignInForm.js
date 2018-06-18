import React, { Component } from 'react';

import { db, auth } from '../../firebase';

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: ""
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({
                    email: "",
                    password: "",
                    error: ""
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                this.setState({
                    error: "Error: " + errorMessage
                });
            });

        event.preventDefault();
    }

    render() {
        const isInvalid = !this.state.email || !this.state.password;

        return (
            <div className={"tip-game-form signin"}>
                <h2>Sign In</h2>
                <form onSubmit={this.onSubmit}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={event => this.setState({email: event.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={event => this.setState({password: event.target.value })}
                    />
                    <button
                        type="submit"
                        disabled={isInvalid}
                    >
                    Sign In
                    </button>
                    {this.state.error && <p>{this.state.error}</p>}
                </form>
            </div>
        );
    }
}

export default SignInForm;