import React from 'react';

import FixtureItem from './FixtureItem';

const STATUS_MAP = {
    "runner": "runnerup",
    "winner": "winner"
}

const LABELS_FOR_STATUS = {
    "runnerup": "#2 Group ",
    "winner": "#1 Group "
};

const KnockoutTile = (props) => {
    const stage = props.stage;

    const getTeamObject = (team) => {
        const [ status, groupLetter ] = team.split("_");
        const team_status = STATUS_MAP[status]; // maps string from <team_a> to property name used in group object
        const team_id = props.groups[groupLetter][team_status]; // gets ID of team that had <team_status> in the group

        const placeholder = {
            fifaCode: LABELS_FOR_STATUS[team_status] + groupLetter.toUpperCase()
        };

        const teamObj = typeof team_id === "number" ? props.groups[groupLetter].teams.find(team => team.id === team_id) : placeholder;

        return teamObj;
    };

    return (
        <div className="knockout-tile">
            <h3 className="tile-title">{stage.name}</h3>

            <div className="tile-inner">
                {stage.matches.map((match, index) => {
                    if(match.type === "qualified") {
                        const home_team = getTeamObject(match.home_team);
                        const away_team = getTeamObject(match.away_team);

                        return <FixtureItem key={index} groupId={stage.id} home={home_team} away={away_team} match={match} onResultChange={() => {}}/>
                    } else {
                        return <FixtureItem key={index} groupId={stage.id} home={""} away={""} match={match} onResultChange={() => {}}/>
                    }
                })}
            </div>

        </div>
    );
};

export default KnockoutTile;