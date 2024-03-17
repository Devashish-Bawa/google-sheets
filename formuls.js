for(let i = 0 ; i < rows; i++) {
    for(let j = 0 ; j < cols ; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e) => {
            let address = addressBar.value;
            let [activeCell,cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if(enteredData == cellProp.value) return;
            
            cellProp.value = enteredData;

            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            // if data modified update 
            updateChildrenCells(address);
        })
    }
} 

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async(e)=>{
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && formulaBar.value) {
       
        //first see if there is any change in the formula or not
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);

        //if there is a new formula , then break old parent child relation and establish a new one.
        if(inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }

        //store parent to children relation
        addchildToGraphComponent(inputFormula,address);

        //before evaluating formula check if formula is cyclic or not
        // true -> cyclic and False -> non cyclic
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse) {
            
            let response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            while(response === true) {
                //keep on tracking color until user is satisfied.
                await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
                response = confirm("Your formula is cyclic. Do you want to trace your path ?");
            }
            removeChildFromParentGraphComponent(inputFormula,address);
            return;
        }

        let evaluatedValue = evaluateFormula(inputFormula);
        

        // to update cell ui and cell properties.
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        
        //make new child-parent relation
        addChildToParent(inputFormula);

        //also update the dependent children.
        updateChildrenCells(address);
    }
})

function evaluateFormula(formula) {
    //split the entire formula into arrays of cell address, numbers and arithmetic operators.
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length ; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);

        // if the ascii code of the the encodedFormula matches with any alphabet 
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [cell,cellProp] = getCellAndCellProp(encodedFormula[i]);

            //replacing the address of the cell with its value.
            encodedFormula[i] = cellProp.value;
        }
    }

    // join the entire array of values and arithmetic operators with spaces into a string.
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula,address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    //update cell ui
    cell.innerText = evaluatedValue;

    //update in db, which is cell properties
    cellProp.formula = formula;
    cellProp.value = evaluatedValue;
}

//this is the recursive method.
function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i =0; i < children.length; i++) {
        let childAddress = children[i];

        let[childCell, childCellProp] = getCellAndCellProp(childAddress);

        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress); //recursive call // base case not required as this for loop condition will act as base case.
    }
}


function addChildToParent(formula) {
    //child will be the node at which cursor is present , so its address can be get from address bar
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length ; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);

        // if the ascii code of the the encodedFormula matches with any alphabet 
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell,parentCellProperties] = getCellAndCellProp(encodedFormula[i]);

            //pushing children address in the parent cell properties 'children' Array 
            parentCellProperties.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length ; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);

        // if the ascii code of the the encodedFormula matches with any alphabet 
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell,parentCellProperties] = getCellAndCellProp(encodedFormula[i]);

            let childIndex = parentCellProperties.children.indexOf(childAddress);
            //pushing children address in the parent cell properties 'children' Array 
            parentCellProperties.children.splice(childIndex, 1);
        }
    }
}

// why formula ? -> to get parents info, i.e in which cell should child's decoded address will be added
// why childAddress ? -> to get child's info, which will be added to the parent cell array of graphComponentMatrix
function addchildToGraphComponent(formula, childAddress) {
    let [childRowId, childColId] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length ; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentRowId, parentColId] = decodeRIDCIDFromAddress(encodedFormula[i]);

            // rowId -> i, colId -> j
            // from [parentRowId][parentColId] we get to parent cell's correct location, and then in parent cell we add children rowId, colId;
            debugger;
            graphComponentMatrix[parentRowId][parentColId].push([childRowId,childColId]);
        }
    }
}


function removeChildFromParentGraphComponent(formula, childAddress) {
    let [childRowId, childColId] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length ; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [parentRowId, parentColId] = decodeRIDCIDFromAddress(encodedFormula[i])

            // rowId -> i, colId -> j
            // from [parentRowId][parentColId] we get to parent cell's correct location, and then in parent cell we remove children rowId, colId;
            graphComponentMatrix[parentRowId][parentColId].pop();
        }
    }
}