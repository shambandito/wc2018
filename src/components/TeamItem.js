import React from 'react';

const TeamItem = (props) => {
    return (
      <div className="table-team">
        <span className="team-position">{props.position}</span>
        <div className="team-name">
          <img src={props.flag} alt={props.fifaCode}/>
          <span>{props.name}</span>
        </div>
        <span className="team-goals">{props.goalsFor + ":" + props.goalsAgainst}</span>
        <span className="team-played">{props.played}</span>
        <span className="team-points">{props.points}</span>
      </div>
    );
};

export default TeamItem;