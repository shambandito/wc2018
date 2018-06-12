import React, { Component } from 'react';

import FixtureItem from './FixtureItem';

class GroupFixtures extends Component {
    constructor(props) {
      super(props);

      this.state = {
        expanded: false
      };

      this.handleExpandPress = this.handleExpandPress.bind(this);
    }

    handleExpandPress() {
      this.setState({
        expanded: !this.state.expanded
      })
    }

    render() {
      const group = this.props.groupData;

      return (
        <div className={"group-tile-expand " + (this.state.expanded ? "expanded": "")}>
          <div className="expand-inner">
            {group.matches.map((match, index) => {
              const home_team = this.props.teams.find(team => team.id === match.home_team);
              const away_team = this.props.teams.find(team => team.id === match.away_team);

              return <FixtureItem key={index} groupId={group.id} home={home_team} away={away_team} match={match} onResultChange={this.props.onResultChange}/>
            })}
          </div>
          <button className="expand-button" onClick={ this.handleExpandPress }>{this.state.expanded ? "Collapse" : "Expand"}</button>
        </div>
      );
    }
  };

  export default GroupFixtures;