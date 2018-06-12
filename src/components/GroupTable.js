import React from 'react';

import TeamItem from './TeamItem';

const GroupTable = (props) => {
    return (
      <div className="group-tile-table">
        <div className="table-header">
          <span className="team-position" title="Position">#</span>
          <span className="team-name">Nation</span>
          <span className="team-goals" title="Goal difference">GD</span>
          <span className="team-played" title="Games played">GP</span>
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