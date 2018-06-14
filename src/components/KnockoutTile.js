import React, { Component } from 'react';

import FixtureItem from './FixtureItem';

const LABELS_FOR_STATUS = {
    "winner": "#1 Group ",
    "runner": "#2 Group "
};

const STAGE_IDS = {
    SIXTEEN: "round_16",
    QUARTER: "round_8",
    SEMI: "round_4",
    THIRDPLACE: "round_2_loser",
    FINAL: "round_2"
}

class KnockoutTile extends Component {
    constructor(props) {
        super(props);

        this.getTeamObject = this.getTeamObject.bind(this);
        this.createRound16Item = this.createRound16Item.bind(this);
        this.createQuarterItem = this.createQuarterItem.bind(this);
        this.createSemiItem = this.createSemiItem.bind(this);
        this.createThirdPlaceItem = this.createThirdPlaceItem.bind(this);

        this.getQuarterTeams = this.getQuarterTeams.bind(this);
        this.getSemiTeams = this.getSemiTeams.bind(this);
        this.getThirdPlaceTeams = this.getThirdPlaceTeams.bind(this);
    }

    createRound16Item(match) {
        const home_team = this.getTeamObject(match.home_team);
        const away_team = this.getTeamObject(match.away_team);

        return <FixtureItem key={match.name} stageId={this.props.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
    }

    createQuarterItem(match) {
        const [home_team, away_team] = this.getQuarterTeams(match.home_team, match.away_team);

        return <FixtureItem key={match.name} stageId={this.props.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
    }

    createSemiItem(match) {
        const [home_team, away_team] = this.getSemiTeams(match.home_team, match.away_team);

        return <FixtureItem key={match.name} stageId={this.props.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
    }

    createThirdPlaceItem(match) {
        const [home_team, away_team] = this.getThirdPlaceTeams(match.home_team, match.away_team);

        return <FixtureItem key={match.name} stageId={this.props.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
    }

    createFinalItem(match) {
        const [home_team, away_team] = this.getFinalTeams(match.home_team, match.away_team);

        return <FixtureItem key={match.name} stageId={this.props.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
    }

    /**
     *
     * @param {String} qualifier - The position and group of the team to be found
     * @return {Object} Team object
     */
    getTeamObject(qualifier) {
        const [ status, groupId ] = qualifier.split("_");
        const group = this.props.groups[groupId];

        let teamObj = {
            fifaCode: LABELS_FOR_STATUS[status] + groupId.toUpperCase()
        };

        if(status === "winner" && !!group.winner) {
            teamObj = group.teams[0];
        } else if(status === "runner" && !!group.runnerup) {
            teamObj = group.teams[1];
        }

        return teamObj;
    };

    /**
     *
     * @param {Number} homeMatchId - Winner of the match with this ID is the home team of the quarter final
     * @param {Number} awayMatchId - Winner of the match with his ID is the away team of the quarter final
     * @return {Array} Team objects [home, away]
     */
    getQuarterTeams(homeMatchId, awayMatchId) {
        const round16 = this.props.stages[STAGE_IDS.SIXTEEN];

        const round16ForQuarterHome = round16.matches.find(match => match.name === homeMatchId && !!match.winner);
        const round16ForQuarterAway = round16.matches.find(match => match.name === awayMatchId && !!match.winner);

        let home_team = { fifaCode: "Winner M" + homeMatchId };
        let away_team = { fifaCode: "Winner M" + awayMatchId };

        if(round16ForQuarterHome) {
            home_team = this.getTeamObject(round16ForQuarterHome[`${round16ForQuarterHome.winner}_team`]);
        }

        if(round16ForQuarterAway) {
            away_team = this.getTeamObject(round16ForQuarterAway[`${round16ForQuarterAway.winner}_team`]);
        }

        return [home_team, away_team];
    }

    /**
     *
     * @param {Number} homeMatchId - Winner of the match with this ID is the home team of the semi final
     * @param {Number} awayMatchId - Winner of the match with his ID is the away team of the semi final
     * @return {Array} Team objects [home, away]
     */
    getSemiTeams(homeMatchId, awayMatchId) {
        const roundQuarter = this.props.stages[STAGE_IDS.QUARTER];

        const quarterForSemiHome = roundQuarter.matches.find(match => match.name === homeMatchId && !!match.winner) || {};
        const quarterForSemiAway = roundQuarter.matches.find(match => match.name === awayMatchId && !!match.winner) || {};

        const round16MatchA = quarterForSemiHome[`${quarterForSemiHome.winner}_team`] || homeMatchId;
        const round16MatchB = quarterForSemiAway[`${quarterForSemiAway.winner}_team`] || awayMatchId;

        const teams = this.getQuarterTeams(round16MatchA, round16MatchB);

        return teams;
    }

    /**
     *
     * @param {Number} homeMatchId - Loser of the match with this ID is the home team of the third place playoff
     * @param {Number} awayMatchId - Loser of the match with his ID is the away team of the third place playoff
     * @return {Array} Team objects [home, away]
     */
    getThirdPlaceTeams(homeMatchId, awayMatchId) {
        const roundSemi = this.props.stages[STAGE_IDS.SEMI];

        let quarterMatchA = homeMatchId;
        let quarterMatchB = awayMatchId;

        if(roundSemi.matches[0].winner === "home") {
            quarterMatchA = roundSemi.matches[0].away_team;
        } else if(roundSemi.matches[0].winner === "away") {
            quarterMatchA = roundSemi.matches[0].home_team;
        }

        if(roundSemi.matches[1].winner === "home") {
            quarterMatchB = roundSemi.matches[1].away_team;
        } else if(roundSemi.matches[1].winner === "away") {
            quarterMatchB = roundSemi.matches[1].home_team;
        }

        const teams = this.getSemiTeams(quarterMatchA, quarterMatchB);

        // ensure correct placeholder labels
        teams[0].fifaCode = teams[0].fifaCode.indexOf(homeMatchId) > 0 ? "Loser M" + homeMatchId : teams[0].fifaCode;
        teams[1].fifaCode = teams[1].fifaCode.indexOf(awayMatchId) > 0 ? "Loser M" + awayMatchId : teams[1].fifaCode;

        return teams;
    }

    getFinalTeams(homeMatchId, awayMatchId) {
        const roundSemi = this.props.stages[STAGE_IDS.SEMI];

        const quarterMatchA = roundSemi.matches[0][`${roundSemi.matches[0].winner}_team`] || homeMatchId;
        const quarterMatchB = roundSemi.matches[1][`${roundSemi.matches[1].winner}_team`] || awayMatchId;

        const teams = this.getSemiTeams(quarterMatchA, quarterMatchB);

        return teams;
    }

    render() {
        const currentStage = this.props.stages[this.props.id];

        return (
            <div className="knockout-tile">
                <h2 className="tile-title">{currentStage.name}</h2>
                <div className="tile-inner">
                    {currentStage.matches.map((match, index) => {
                        let item = null;

                        switch (this.props.id) {
                            case STAGE_IDS.SIXTEEN:
                                item = this.createRound16Item(match);
                                break;
                            case STAGE_IDS.QUARTER:
                                item = this.createQuarterItem(match);
                                break;
                            case STAGE_IDS.SEMI:
                                item = this.createSemiItem(match);
                                break;
                            case STAGE_IDS.THIRDPLACE:
                                item = this.createThirdPlaceItem(match);
                                break;
                            case STAGE_IDS.FINAL:
                                item = this.createFinalItem(match);
                                break;
                            default:
                                break;
                        }

                        return item;
                    })}
                </div>
            </div>
        );
    }
};



export default KnockoutTile;