// for delay and wait
function colorPromise() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve();
        },1000);
    });
}


async function isGraphCyclicTracePath(graphComponentMatrix,cycleResponse) {
    let [srcr,srcc] = cycleResponse;
    let visited = [];
    let dfsVisited = [];

    for(let i =0 ; i < rows ; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0 ; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    let response = await dfsCycleDetectionTracePath(graphComponentMatrix,srcr,srcc,visited,dfsVisited);
    if(response === true) return Promise.resolve(true);;

    return Promise.resolve(false);;
}

// coloring cells for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcRowId, srcColId, visited, dfsVisited) {
    visited[srcRowId][srcColId] = true;
    dfsVisited[srcRowId][srcColId] = true;

    let cell = document.querySelector(`.cell[rid="${srcRowId}"][cid="${srcColId}"]`);
    cell.style.backgroundColor = "lightblue";
    await colorPromise(); //will pause for 1 second on function level

    for(let children = 0 ; children < graphComponentMatrix[srcRowId][srcColId].length ; children++){
        let [childRowId, childColId] = graphComponentMatrix[srcRowId][srcColId][children];
        if(visited[childRowId][childColId] === false)  {
           let response = await dfsCycleDetectionTracePath(graphComponentMatrix, childRowId, childColId, visited, dfsVisited)
           if(response === true) {
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
           }
        }
        else if(visited[childRowId][childColId] === true && dfsVisited[childRowId][childColId] === true ) {
            let cyclicCell = document.querySelector(`.cell[rid="${childRowId}"][cid="${childColId}"]`);
            
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();

            cyclicCell.style.backgroundColor = "transparent";

            cell.style.backgroundColor = "transparent";
            await colorPromise();

            return Promise.resolve(true);;
        }
    }

    dfsVisited[srcRowId][srcColId] = false;


    return Promise.resolve(false);;
}