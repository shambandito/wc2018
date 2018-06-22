import React, { Component } from 'react';

import FixtureItem from './FixtureItem';
import FixtureTooltip from './FixtureTooltip';

class GroupFixtures extends Component {
    constructor(props) {
      super(props);

      this.state = {
        expanded: false,
        tooltip: null
      };

      this.handleExpandPress = this.handleExpandPress.bind(this);
      this.showTooltip = this.showTooltip.bind(this);
      this.hideTooltip = this.hideTooltip.bind(this);
    }

    handleExpandPress() {
      this.setState({
        expanded: !this.state.expanded
      })
    }

    showTooltip(options) {
      const channels = options.channels.map((channelId) => {
        return this.props.channels[channelId - 1];
      });

      this.setState({
        tooltip: {
          stadium: this.props.stadiums[options.stadium - 1] || {},
          channels: channels,
          offset: options.offset,
          matchNumber: options.matchNumber
        }
      });
    }

    hideTooltip() {
      this.setState({
        tooltip: null
      });
    }

    render() {
      const group = this.props.groupData;

      return (
        <div className={"group-tile-expand " + (this.state.expanded ? "expanded": "")}>
          <button className="expand-button" onClick={ this.handleExpandPress }><i className="material-icons expand-icon">expand_more</i></button>
          <div className="expand-inner">
            {group.matches.map((match, index) => {
              const home_team = this.props.teams.find(team => team.id === match.home_team);
              const away_team = this.props.teams.find(team => team.id === match.away_team);

              return (
                <FixtureItem
                  key={index}
                  stageId={group.id}
                  home={home_team}
                  away={away_team}
                  match={match}
                  onResultChange={this.props.onResultChange}
                  onShowTooltip={this.showTooltip}
                  onHideTooltip={this.hideTooltip}
                />
              );
            })}
          </div>

            {!!this.state.tooltip && <FixtureTooltip info={this.state.tooltip} />}
        </div>
      );
    }
  };

  export default GroupFixtures;