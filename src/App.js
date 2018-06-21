import React, { Component } from 'react';
import './App.css';

import GroupTile from './components/GroupTile';
import KnockoutTile from './components/KnockoutTile';

//import DATA from './data/data';

const DATA_URL = "https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json";
const TEAMS_PER_GROUP = 4;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stadiums: [],
      tvchannels: [],
      teams: [],
      groups: {},
      knockout: {}
    };

    this.getTournamentData = this.getTournamentData.bind(this);
    this.updateMatchDataForTeam = this.updateMatchDataForTeam.bind(this);
    this.updateMatchDataForGroup = this.updateMatchDataForGroup.bind(this);
    this.onGroupResultChange = this.onGroupResultChange.bind(this);
    this.onKnockoutResultChange = this.onKnockoutResultChange.bind(this);

    this.createGroups = this.createGroups.bind(this);
    this.updateTeamsInGroup = this.updateTeamsInGroup.bind(this);
    this.sortTeams = this.sortTeams.bind(this);
  }

  componentDidMount() {
    this.getTournamentData();
  }

  render() {
    const noDataYet = Object.keys(this.state.groups).length === 0;

    return (
      <div className="App">
        <div className={"loading-indicator " + (noDataYet ? "active" : "")}></div>
        <div className={"container " + (noDataYet ? "" : "active")}>
          <h1 className="app-title">World Cup 2018 Planner</h1>
          <p className="app-info">(Be aware: any simulated results will be overwritten by the actual results)</p>
          <div className="group-wrap">
            {this.createGroups()}
          </div>
          <div className="knockout-wrap">
            {this.createKnockoutStages()}
          </div>
        </div>
      </div>
    );
  }

  getTournamentData() {
    const userData = !!localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;

    fetch(DATA_URL).then((result) => {
      return result.json();
    }).then((data) => {
      Object.keys(data.groups).forEach((key, index) => {
        let group = data.groups[key];

        const startIndex = index * TEAMS_PER_GROUP;
        const endIndex = (index * TEAMS_PER_GROUP) + TEAMS_PER_GROUP;

        const teams = data.teams.slice(startIndex, endIndex);

        for(let i = 0; i < group.matches.length; i++) {
          const match = group.matches[i];

          match.alreadyPlayed = typeof match.home_result === "number" && typeof match.away_result === "number"; // set flag if match has already been played

          // get user entered data from local storage if available
          if(!match.alreadyPlayed && userData) {
            const userDataGroup = userData.groups[key];
            const userDataMatch = userDataGroup.matches[i];

            match.home_result = typeof userDataMatch.home_result === "number" ? userDataMatch.home_result : "";
            match.away_result = typeof userDataMatch.away_result === "number" ? userDataMatch.away_result : "";
          }
        }

        group.id = key;
        group = this.updateTeamsInGroup({
          ...group,
          teams
        });

        data.groups[key] = group;
      });

      Object.keys(data.knockout).forEach((key, index) => {
        let stage = data.knockout[key];

        for(let i = 0; i < stage.matches.length; i++) {
          const match = stage.matches[i];

          match.alreadyPlayed = typeof match.home_result === "number" && typeof match.away_result === "number"; // set flag if match has already been played

          // get user entered data from local storage if available
          if(!match.alreadyPlayed && userData) {
            const userDataStage = userData.knockout[key];
            const userDataMatch = userDataStage.matches[i];

            match.home_result = typeof userDataMatch.home_result === "number" ? userDataMatch.home_result : "";
            match.away_result = typeof userDataMatch.away_result === "number" ? userDataMatch.away_result : "";
          }
        }
      });

      this.setState(data);
    });
  }

  onGroupResultChange(options) {
    this.setState((currentState) => {
      let updatedMatches, updatedGroup;

      for(let key in currentState.groups) {
        if(key !== options.stageId) continue; // only handle group that has changed

        const group = currentState.groups[key];

        const updatedMatch = {
          ...group.matches.find(match => match.name === options.matchId),
          [options.isHome ? "home_result" : "away_result"]: options.score
        };

        updatedMatches = currentState.groups[options.stageId].matches.map(match => {
          return match.name === options.matchId ? updatedMatch : match;
        });

        updatedGroup = this.updateTeamsInGroup({
          ...currentState.groups[options.stageId],
          matches: updatedMatches
        });

        const groupNotFinished = updatedGroup.teams.some(team => team.played !== 3);

        // set teams qualified for KO-round if all teams have played 3 games
        updatedGroup.winner = !groupNotFinished ? updatedGroup.teams[0].id : null;
        updatedGroup.runnerup = !groupNotFinished ? updatedGroup.teams[1].id : null;
      }

      const updatedGroups = {
        ...currentState.groups,
        [options.stageId]: updatedGroup
      };

      const updatedState = {
        ...currentState,
        groups: updatedGroups
      };

      localStorage.setItem("userData", JSON.stringify(updatedState));

      return updatedState;
    });
  }

  onKnockoutResultChange(options) {
    this.setState((currentState) => {
      const matches = currentState.knockout[options.stageId].matches;
      const currentMatch = matches.find(match => match.name === options.matchId);

      const updatedMatch = {
        ...currentMatch,
        [options.isHome ? "home_result" : "away_result"]: options.score
      };

      // match has valid result
      if(typeof updatedMatch.home_result === "number" && typeof updatedMatch.away_result === "number") {
        if(updatedMatch.home_result > updatedMatch.away_result) {
          updatedMatch.winner = "home";
        } else if(updatedMatch.home_result < updatedMatch.away_result) {
          updatedMatch.winner = "away";
        } else {
          updatedMatch.winner = null;
        }
      } else {
        updatedMatch.winner = null;
      }

      const updatedMatches = matches.map(match => {
        return match.name === options.matchId ? updatedMatch : match;
      });

      const updatedStage = {
        ...currentState.knockout[options.stageId],
        matches: updatedMatches
      };

      const updatedKnockout = {
        ...currentState.knockout,
        [options.stageId]: updatedStage
      };

      const updatedState = {
        ...currentState,
        knockout: updatedKnockout
      };

      localStorage.setItem("userData", JSON.stringify(updatedState));

      return updatedState;
    });
  }

  createGroups() {
    const tiles = Object.keys(this.state.groups).map((key, index) => {
      const group = this.state.groups[key];

      return <GroupTile key={index} groupData={group} teams={group.teams} onResultChange={this.onGroupResultChange} />;
    });

    return tiles;
  }

  updateTeamsInGroup(group) {
    const teams = this.sortTeams(this.updateMatchDataForGroup(group));

    return {
      ...group,
      teams
    };
  }

  updateMatchDataForTeam(matches, teamId) {
    const result = {
      points: 0,
      played: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    for(let match of matches) {
      const isHomeTeam = match.home_team === teamId;
      const isAwayTeam = match.away_team === teamId;

      const noValidResult = typeof match.home_result !== "number" || typeof match.away_result !== "number" || isNaN(match.home_result) || isNaN(match.away_result);

      if(noValidResult || (!isHomeTeam && !isAwayTeam)) {
        continue;
      }

      const isHomeWin = match.home_result > match.away_result;
      const isAwayWin = match.home_result < match.away_result;

      if(isHomeTeam) {
        result.played++;
        result.goalsFor += match.home_result;
        result.goalsAgainst += match.away_result;

        if(isHomeWin) {
          result.points += 3;
        }
      } else if(isAwayTeam) {
        result.played++;
        result.goalsFor += match.away_result;
        result.goalsAgainst += match.home_result;

        if(isAwayWin) {
          result.points += 3;
        }
      }

      // draw
      if((isAwayTeam || isHomeTeam) && (!isHomeWin && !isAwayWin)) {
        result.points += 1;
      }
    }

    return result;
  }

  updateMatchDataForGroup(group) {
    const teams = group.teams.map((team) => {
      const matchData = this.updateMatchDataForTeam(group.matches, team.id);

      return  {...team, ...matchData};
    });

    return teams;
  }

  sortTeams(teams) {
    const sortedTeams = teams.sort((teamA, teamB) => {
      //@TODO: no handling for same amount of points & same goal difference
      if(teamB.points === teamA.points) { // same points

        if(teamB.goalsFor === teamA.goalsFor) { // same goals scored
          return teamA.goalsAgainst - teamB.goalsAgainst;
        }

        return teamB.goalsFor - teamA.goalsFor;
      }

      return teamB.points - teamA.points;
    });

    return sortedTeams;
  }

  createKnockoutStages() {
    const tiles = Object.keys(this.state.knockout).map((stageKey, index) => {
      return (
        <KnockoutTile
          key={index}
          id={stageKey}
          stages={this.state.knockout}
          teams={this.state.teams}
          groups={this.state.groups}
          onResultChange={this.onKnockoutResultChange}
        />
      );
    });

    return tiles;
  }
}

export default App;
