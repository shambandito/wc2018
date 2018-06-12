import React, { Component } from 'react';

class FixtureItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            homeResult: typeof props.match.home_result === "number" ? props.match.home_result : "",
            awayResult: typeof props.match.home_result === "number" ? props.match.away_result : ""
        }

        this.isInputValid = this.isInputValid.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    isInputValid(value) {
        return /[0-9]/g.test(value) || value === "";
    }

    handleInputChange(event, isHome) {
        if(!this.isInputValid(event.target.value)) return;

        this.setState({
            [isHome ? "homeResult" : "awayResult"]: event.target.value
        });

        this.props.onResultChange({
            score: event.target.value,
            groupId: this.props.groupId,
            matchId: this.props.match.name,
            isHome: isHome
        });
    }

    render() {
        const props = this.props;

        const home = props.home;
        const away = props.away;

        const date = new Date(props.match.date);
        const matchAlreadyPlayed = !!props.match.alreadyPlayed;

        return (
            <div className="fixture-item">
                <div className="fixture-date">
                    <span>{date.toDateString()}</span>
                    <span>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}</span>
                </div>

                <div className="fixture-teams">
                    <FixtureTeam teamData={home} winner={this.state.homeResult > this.state.awayResult} />
                    <span className="fixture-separator" title={"Match " + props.match.name}>v</span>
                    <FixtureTeam teamData={away} winner={this.state.awayResult > this.state.homeResult} />
                </div>

                <div className="fixture-result">
                    <input
                        type="text"
                        disabled={matchAlreadyPlayed}
                        value={this.state.homeResult}
                        onChange={(event) => { this.handleInputChange(event, true) }}
                    />
                    <span className="fixture-separator">:</span>
                    <input
                        type="text"
                        disabled={matchAlreadyPlayed}
                        value={this.state.awayResult}
                        onChange={(event) => { this.handleInputChange(event, false) }}
                    />
                </div>
            </div>
        );
    }
};

const FixtureTeam = (props) => {
    return (
        <div className={"team-name " + (props.winner ? "winner" : "")} title={props.teamData.name}>
            <img src={props.teamData.flag} alt={props.teamData.fifaCode}/>
            <span>{props.teamData.fifaCode}</span>
        </div>
    );
};

export default FixtureItem;