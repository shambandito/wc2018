import React, { Component } from 'react';

import { db, auth } from '../../firebase';

class SignUpForm extends Component {
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
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((authUser) => {
                // Create a user in our own Firebase Database
                db.createUser(authUser.user.uid, this.state.email).then(() => {
                    this.setState({
                        email: "",
                        password: "",
                        error: ""
                    });
                }).catch((error) => {
                    this.setState({
                        error: "Error: " + error.message
                    });
                });
            })
            .catch((error) => {
                this.setState({
                    error: "Error: " + error.message
                })
            });

        event.preventDefault();
    }

    render() {
        const isInvalid = !this.state.email || !this.state.password;

        return (
            <div className={"tip-game-form signup"}>
                <h2>Sign Up</h2>
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
                    Sign Up
                    </button>
                    {this.state.error && <p>{this.state.error}</p>}
                </form>
            </div>
        );
    }
}

export default SignUpForm;