//Storage : 2D array 
// this storage is parentMatrix , its every cell will be an array, which contains children address
let collectedGraphComponentMatrix = [];

let graphComponentMatrix = [];

/*
for(let i = 0 ;i < rows; i++) {
    let row = [];
    for(let j = 0 ; j < cols ; j++) {
        //why array? -> as a single parent can have multiple children
        row.push([]);
    }
    graphComponentMatrix.push(row);
}*/

// this method will return boolean if there is a cycle or not.
// true -> cyclic and False -> non cyclic
function isGraphCyclic() {
    // will have 2d visited and dfs visited array.
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

    for(let i =0 ; i < rows ; i++) {
        for(let j = 0 ; j < cols; j++) {
            if(visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix,i,j,visited,dfsVisited);
                if(response === true) return [i,j];
            }
        }
    }
    return null;
}


function dfsCycleDetection(graphComponentMatrix, srcRowId, srcColId, visited, dfsVisited) {
    visited[srcRowId][srcColId] = true;
    dfsVisited[srcRowId][srcColId] = true;

    for(let children = 0 ; children < graphComponentMatrix[srcRowId][srcColId].length ; children++){
        let [childRowId, childColId] = graphComponentMatrix[srcRowId][srcColId][children];
        if(visited[childRowId][childColId] === false)  {
           let response = dfsCycleDetection(graphComponentMatrix, childRowId, childColId, visited, dfsVisited)
           if(response === true) {
                return true;
           }
        }
        else if(visited[childRowId][childColId] === true && dfsVisited[childRowId][childColId] === true ) {
            return true;
        }
    }

    dfsVisited[srcRowId][srcColId] = false;
    return false;
}