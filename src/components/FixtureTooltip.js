import React from 'react';

const FixtureTooltip = (props) => {
    const stadium = props.info.stadium;

    const channels = props.info.channels.map((channel) => {
        return <img className="tooltip-channel" key={channel.id} src={channel.icon} title={channel.name} alt={channel.name} />
    });

    return (
        <div className="fixture-tooltip" style={{bottom: "calc(100% - " + props.info.offset + "px)"}}>
            <p className="tooltip-title">Match {props.info.matchNumber}</p>
            <img src={stadium.image} alt={stadium.name}/>
            <p>{stadium.name}, {stadium.city}</p>
            <p className="tooltip-channels-header">Shown on</p>
            <div className="tooltip-channels">{channels}</div>
        </div>
    );
}

export default FixtureTooltip;