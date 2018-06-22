import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class FixtureItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            homeResult: typeof props.match.home_result === "number" ? props.match.home_result : "",
            awayResult: typeof props.match.away_result === "number" ? props.match.away_result : ""
        };

        this.isInputValid = this.isInputValid.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleShowTooltip = this.handleShowTooltip.bind(this);
        this.handleHideTooltip = this.handleHideTooltip.bind(this);
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

    handleShowTooltip() {
        const domNode = ReactDOM.findDOMNode(this);

        const offsetTop = domNode.offsetTop;

        if(this.props.onShowTooltip) {
            this.props.onShowTooltip({
                offset: offsetTop,
                stadium: this.props.match.stadium,
                channels: this.props.match.channels,
                matchNumber: this.props.match.name
            });
        }
    }

    handleHideTooltip() {
        if(this.props.onHideTooltip) {
            this.props.onHideTooltip();
        }
    }

    render() {
        const date = new Date(this.props.match.date);
        const matchAlreadyPlayed = !!this.props.match.alreadyPlayed;

        const bothResultsValid = this.state.homeResult !== "" && this.state.awayResult !== "";

        const homeWon = bothResultsValid && this.state.homeResult > this.state.awayResult;
        const awayWon = bothResultsValid && this.state.homeResult < this.state.awayResult;

        return (
            <div className="fixture-item">
                <FixtureDate date={date} matchNumber={this.props.match.name} onMouseEnter={this.handleShowTooltip} onMouseLeave={this.handleHideTooltip} />

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
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = {5: "Jun", 6: "Jul"};

    const weekDay = weekDays[props.date.getDay()];
    const day = props.date.getDate();
    const month = months[props.date.getMonth()];

    return (
        <div className="fixture-date" onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
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
            pattern="[0-9]*"
            inputMode="numeric"
            disabled={props.alreadyPlayed}
            value={props.result}
            onChange={(event) => { props.onChange(event, props.isHome) }}
        />
    );
};

export default FixtureItem;