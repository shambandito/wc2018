export function injectUserData(stageKey, matches, userData) {
    const updatedMatches = [];

    for(let i = 0; i < matches.length; i++) {
        const match = { ...matches[i] };
        const isGroupMatch = match.type === "group";

        match.alreadyPlayed = matchHasValidResult(match) || match.finished;

        // get user entered data from local storage if available
        if(!match.alreadyPlayed && userData) {
            const userDataStage = isGroupMatch ? userData.groups[stageKey] : userData.knockout[stageKey];
            const userDataMatch = userDataStage.matches[i];

            match.home_result = userDataMatch.home_result;
            match.away_result = userDataMatch.away_result;
        }

        if(!isGroupMatch) {
            match.winner = getKnockoutMatchWinner(match);
        }

        updatedMatches.push(match);
    }

    return updatedMatches;
}

export function getKnockoutMatchWinner(match) {
    const hasValidResult = matchHasValidResult(match);

    let winner = null;

    if(hasValidResult && match.home_result > match.away_result) {
        winner = "home";
    } else if(hasValidResult && match.home_result < match.away_result) {
        winner = "away";
    }

    return winner;
}

function matchHasValidResult(match) {
    return typeof match.home_result === "number" && typeof match.away_result === "number";
}