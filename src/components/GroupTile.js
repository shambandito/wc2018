import React from 'react';

import GroupFixtures from './GroupFixtures';
import GroupTable from './GroupTable';

const GroupTile = (props) => {
    const group = props.groupData;

    if(!props.teams) return null;

    return (
        <div className={"group-tile " + (!!group.winner ? "finished" : "")}>
            <h3 className="tile-title">{group.name}</h3>

            <div className="tile-inner">
                <GroupTable teams={props.teams} />
            </div>

            <GroupFixtures groupData={group} teams={props.teams} onResultChange={props.onResultChange}/>
        </div>
    );
};

export default GroupTile;