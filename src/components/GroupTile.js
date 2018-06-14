import React from 'react';

import GroupFixtures from './GroupFixtures';
import GroupTable from './GroupTable';

const GroupTile = (props) => {
    const group = props.groupData;

    if(!props.teams) return null;

    return (
        <div className={"group-tile " + (!!group.winner ? "finished" : "")}>
            <div className="tile-inner">
                <GroupTable name={group.name} teams={props.teams} />
            </div>

            <GroupFixtures groupData={group} teams={props.teams} onResultChange={props.onResultChange}/>
        </div>
    );
};

export default GroupTile;