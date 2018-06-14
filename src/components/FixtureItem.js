import React, { Component } from 'react';

class FixtureItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            homeResult: typeof props.match.home_result === "number" ? props.match.home_result : "",
            awayResult: typeof props.match.home_result === "number" ? props.match.away_result : ""
        };

        this.isInputValid = this.isInputValid.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    isInputValid(value) {
        return /[0-9]/g.test(value) || value === "";
    }

    handleInputChange(event, isHome) {
        if(!this.isInputValid(event.target.value)) return;

        const value = event.target.value !== "" ? parseInt(event.target.value, 10) : "";

        this.setState({
            [isHome ? "homeResult" : "awayResult"]: value
        });

        this.props.onResultChange({
            score: value,
            stageId: this.props.stageId,
            matchId: this.props.match.name,
            isHome: isHome
        });
    }

    render() {
        const date = new Date(this.props.match.date);
        const matchAlreadyPlayed = !!this.props.match.alreadyPlayed;

        const bothResultsValid = this.state.homeResult !== "" && this.state.awayResult !== "";

        const homeWon = bothResultsValid && this.state.homeResult > this.state.awayResult;
        const awayWon = bothResultsValid && this.state.homeResult < this.state.awayResult;

        return (
            <div className="fixture-item">
                <FixtureDate date={date} matchNumber={this.props.match.name} />

                <div className="fixture-teams">
                    <FixtureTeam teamData={this.props.home} winner={homeWon} />
                    <span className="fixture-separator">v</span>
                    <FixtureTeam teamData={this.props.away} winner={awayWon} />
                </div>

                <div className="fixture-result">
                    <ResultInput alreadyPlayed={matchAlreadyPlayed} result={this.state.homeResult} isHome={true} onChange={this.handleInputChange} />
                    <span className="fixture-separator">:</span>
                    <ResultInput alreadyPlayed={matchAlreadyPlayed} result={this.state.awayResult} isHome={false} onChange={this.handleInputChange} />
                </div>
            </div>
        );
    }
};

const FixtureDate = (props) => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = {5: "Jun", 6: "Jul"};

    const weekDay = weekDays[props.date.getDay()]
    const day = props.date.getDate();
    const month = months[props.date.getMonth()];

    return (
        <div className="fixture-date" title={"Match " + props.matchNumber}>
            <span>{`${weekDay}, ${month} ${day}`}</span>
            <span>{props.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}) + " (M" + props.matchNumber + ")"}</span>
        </div>
    );
};

const FixtureTeam = (props) => {
    return (
        <div className={"team-name " + (props.winner ? "winner" : "")} title={props.teamData.name}>
            <img src={props.teamData.flag} alt={props.teamData.fifaCode}/>
            <span>{props.teamData.fifaCode}</span>
        </div>
    );
};

const ResultInput = (props) => {
    return (
        <input
            type="text"
            disabled={props.alreadyPlayed}
            value={props.result}
            onChange={(event) => { props.onChange(event, props.isHome) }}
        />
    );
};

export default FixtureItem;