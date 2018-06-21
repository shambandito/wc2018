import React from 'react';

import TeamItem from './TeamItem';

const GroupTable = (props) => {
    return (
      <div className="group-tile-table">
        <div className="table-header">
          <h2 className="tile-title">{props.name}</h2>
          <span className="team-name"></span>
          <span className="team-played" title="Games Played">GP</span>
          <span className="team-goals" title="Goal Difference">GD</span>
          <span className="team-points" title="Points">Pts</span>
        </div>

        {props.teams.map((team, i) => {
          return (
            <TeamItem
              key={team.name}
              fifaCode={team.fifaCode}
              position={i + 1}
              name={team.name}
              flag={team.flag}
              played={team.played}
              goalsFor={team.goalsFor}
              goalsAgainst={team.goalsAgainst}
              points={team.points}
            />
          );
        })}
      </div>
    );
};

export default GroupTable;