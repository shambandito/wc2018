import React, { Component } from 'react';
import { db, auth } from '../../firebase';

import FixtureItem from './../FixtureItem';

class TipFixture extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const match = {...this.props.match};

        match.alreadyPlayed = new Date(match.date) < new Date();

        if(!match.alreadyPlayed && this.props.userTip) {
            match.home_result = this.props.userTip.home_result;
            match.away_result = this.props.userTip.away_result;
        } else if(match.alreadyPlayed) {
            match.home_result = typeof match.home_result === "number" ? match.home_result : "-";
            match.away_result = typeof match.away_result === "number" ? match.away_result : "-";
        }

        return (
            <div className="tip-fixture">
                <FixtureItem
                    stageId={""}
                    home={this.props.home}
                    away={this.props.away}
                    match={match}
                    onResultChange={this.props.onTipChange}
                />
                {this.props.userTip && <TipResult homeTip={this.props.userTip.home_result} awayTip={this.props.userTip.away_result} tipScore={0}/>}
            </div>
        );
    }
}

const TipResult = (props) => {
    return (
        <div className="tip-result">
            <span>Tip: </span>
            <span>{props.homeTip} : {props.awayTip}</span>
            <span>(+{props.tipScore})</span>
        </div>
    );
};

export default TipFixture;