import React, { Component } from 'react';

import { firebase, db, auth } from '../../firebase';

import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import TipList from './TipList';

import './../../style/TipGame.css';

class TipGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            users: {},
            authUser: null
        }

        this.signOut = this.signOut.bind(this);
        this.handleTipChange = this.handleTipChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        db.onceGetUsers().then((snapshot) => {
            this.setState({
                users: snapshot.val() || {}
            });
        });

        firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState((currentState) => {
                    return {
                        ...currentState,
                        authUser: user
                    }
                });
            } else {
                this.setState({authUser: null})
            }
        });
    }

    signOut() {
        auth.signOut().then(function() {
            this.setState({authUser: null});
          }).catch(function(error) {
            console.log(error.message);
          });
    }

    handleTipChange(options) {
        this.setState((currentState) => {
            const currentUser = currentState.users[currentState.authUser.uid];

            const updatedTips = {
                ...currentUser.tips,
                [options.matchId]: {
                    ...currentUser.tips[options.matchId],
                    [options.isHome ? "home_result" : "away_result"]: options.score
                }
              };

            const updatedUser = {
                ...currentUser,
                tips: updatedTips
            };

            return {
              ...currentState,
              users: {
                  ...currentState.users,
                  [currentState.authUser.uid]: updatedUser
              }
            };
          });
    }

    handleSave() {
        if(!this.state.authUser) return;

        const authUser = this.state.authUser;

        db.updateUser(authUser.uid, authUser.email, this.state.users[authUser.uid].tips).then(() => {
            console.log("SUCCESSFULLY UPDATED USER");
        }).catch((error) =>  {
            console.log("ERROR: " + error.message);
        });
    }

    render() {
        let userTips = {};

        if(this.state.authUser && this.state.users[this.state.authUser.uid]) {
            userTips = this.state.users[this.state.authUser.uid].tips;
        }

        return (
            <div className={"tip-game-container " + (this.props.active ? "active" : "")}>
                {!!this.state.authUser && <h1>Signed in as {this.state.authUser.email}</h1>}
                {!!this.state.authUser && <button onClick={this.signOut}>Sign Out</button>}
                {!this.state.authUser && <SignUpForm />}
                {!this.state.authUser && <SignInForm />}
                <h2>Users</h2>
                <ul>
                    {Object.keys(this.state.users).map((key) => <li key={key}>{this.state.users[key].email}</li>)}
                </ul>
                {!!this.state.authUser &&
                    <TipList
                        data={this.props.data}
                        userTips={userTips}
                        onTipChange={this.handleTipChange}
                        onSave={this.handleSave}
                    />
                }
            </div>
        );
    }
}

export default TipGame;