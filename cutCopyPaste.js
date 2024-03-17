let ctrlKey;
document.addEventListener("keydown",(e)=>{
    ctrlKey = e.ctrlKey;
})

document.addEventListener("keyup",(e)=>{
    ctrlKey = e.ctrlKey;
})

for(let i = 0 ; i < rows; i++) {
    for(let j = 0 ; j < cols ; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let pasteBtn = document.querySelector(".paste");
let cutBtn = document.querySelector(".cut");

let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", e=>{
        
        // will not do anything if ctrl key is not pressed.
        if(!ctrlKey) return;

        // will only handle and store 2 values.
        if(rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        //ui 
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);
        console.log(rangeStorage);
    })
}

function defaultSelectedCellsUI() {
    for(let i = 0 ; i < rangeStorage.length ; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

//copy button functionality
let copyData = [];
copyBtn.addEventListener("click", (e)=>{

    if(rangeStorage.length < 2) return; 

    //refreshing the data as if copy btn is pressed, it should only copy new values.
    copyData = [];

    let stRow = rangeStorage[0][0];
    let stCol = rangeStorage[0][1];
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];
    for(let i = stRow; i <= endRow; i++) {
        let copyRow = [];
        for(let j = stCol; j <= endCol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();
})

cutBtn.addEventListener("click", (e)=> {
    if(rangeStorage.length < 2) return;

    let [stRow, endRow, stCol, endCol] = [rangeStorage[0][0],rangeStorage[1][0],rangeStorage[0][1],rangeStorage[1][1]];

    for(let i = stRow; i <= endRow; i++) {
        for(let j = stCol ; j <= endCol; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            let cellProp = sheetDB[i][j];

            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline =false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGColor = "#000000";;
            cellProp.alignment = "left";

            cell.click();
        }
    }

    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click", (e)=>{
    //paste cells data


    //get row and col diff
    let rowDiff = Math.abs(rangeStorage[0][0]-rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1]-rangeStorage[1][1]);

    //get address of the destination from the address bar
    let address = addressBar.value;
    let [startRow, startCol] = decodeRIDCIDFromAddress(address);

    for(let i = startRow, r = 0; i <= startRow + rowDiff; i++,r++) {
        for(let j = startCol, c = 0; j <= startCol + colDiff; j++,c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            console.log(cell);

            if(!cell) continue;

            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;

            cell.click();
        }
    }

})

