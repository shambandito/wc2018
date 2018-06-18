import React, { Component } from 'react';

import TipFixture from './TipFixture';

class TipList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        const data = this.props.data;

        const matchDays = {};

        for(let key in data.groups) {
            const group = data.groups[key];

            group.matches.forEach((match) => {
                if(!matchDays[match.matchday]) {
                    matchDays[match.matchday] = [];
                }

                matchDays[match.matchday].push({...match});
            });
        }


        return (
            <div className={"tip-list"}>
                <button onClick={this.props.onSave}>Save</button>
                <div>
                    {Object.keys(matchDays).map((key) => {
                        const matchDay = matchDays[key];

                        matchDay.sort((a, b) => {
                            a = new Date(a.date);
                            b = new Date(b.date);

                            return a < b ? -1 : a > b ? 1 : 0;
                        });

                        const matches = matchDay.map((match, index) => {
                            const home_team = this.props.data.teams.find(team => team.id === match.home_team);
                            const away_team = this.props.data.teams.find(team => team.id === match.away_team);

                            return (
                                <TipFixture
                                    key={index}
                                    stageId={""}
                                    home={home_team}
                                    away={away_team}
                                    match={match}
                                    userTip={this.props.userTips[match.name]}
                                    onResultChange={this.props.onTipChange}
                                />
                            );
                        })

                        return (
                            <div key={"matchday-" + key} className="matchday-block">
                                <h3 key={"matchday-header-" + key} className="matchday-header">{"Matchday " + key}</h3>
                                {matches}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TipList;