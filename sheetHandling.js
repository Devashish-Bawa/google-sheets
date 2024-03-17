let activeSheetColor="#ced6e0";
let sheetFolderCont = document.querySelector('.sheets-folder-cont');
let addSheetBtn = document.querySelector('.sheet-add-icon');
addSheetBtn.addEventListener("click",(e) => {
    let sheet = document.createElement("div");

    sheet.setAttribute("class","sheet-folder");

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id", allSheetFolders.length);

    sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`;

    sheetFolderCont.appendChild(sheet);
    sheet.scrollIntoView();
    
    createSheetDB();   
    createGraphComponentMatrix();

    handleSheetRemoval(sheet);

    handleSheetActiveness(sheet);

    sheet.click(); 
});

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e)=>{
        /*
            e.button === 0 -> left click
                     === 1 -> scroll
                     === 2 -> right click
        */ 
        if(e.button !== 2) {
            return;
        }
        let allSheetFolders = document.querySelectorAll(".sheet-folder");

        if(allSheetFolders.length === 1) {
            alert("You Need to have atleast one sheet.!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Do you want to continue ?");
        if(response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));

        // db removal
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponentMatrix.splice(sheetIdx,1);

        //UI removal
        handleSheetUIRemoval(sheet);
        
        //By default bring sheet 1 to active
        sheetDB=collectedSheetDB[0];
        graphComponentMatrix=collectedGraphComponentMatrix[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet) {  
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for(let i = 0; i < allSheetFolders.length; i++) {
        allSheetFolders[i].setAttribute("id",i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    //as first sheet is activated.
    allSheetFolders[0].style.backgroundColor=activeSheetColor;
}

function handleSheetDb(sheedIdx) {
    sheetDB = collectedSheetDB[sheedIdx];
    graphComponentMatrix = collectedGraphComponentMatrix[sheedIdx];
}

function handleSheetProperties() {
    for(let i = 0 ; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    //by default click on first cell, so as to display address.
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet) {
    let allSheetsFolder = document.querySelectorAll('.sheet-folder');
    for(let i = 0 ; i < allSheetsFolder.length; i++) {
        allSheetsFolder[i].style.backgroundColor = "transparent";
    }
    sheet.style.backgroundColor=activeSheetColor;
}

function handleSheetActiveness(sheet) {
    //add a listener to the sheet
    sheet.addEventListener("click", (e) => {
        let sheedIdx = Number(sheet.getAttribute("id"));
        handleSheetDb(sheedIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}


function createSheetDB() {
    let sheetDB = [];

    for(let i = 0 ; i < rows; i++) {
        let sheetRow = [];
        for(let j = 0; j < cols; j++) {
            let cellProp = {
                bold: false,
                italic : false,
                underline : false,
                alignment: "left",
                fontFamily : "monospace",
                fontSize :  "14",
                fontColor : "#000000",
                BGColor : "#000000", // just for indication purpose
                value : "",
                formula : "",
                children :[]
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }

    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];

    for(let i = 0 ;i < rows; i++) {
        let row = [];
        for(let j = 0 ; j < cols ; j++) {
            //why array? -> as a single parent can have multiple children
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }

    collectedGraphComponentMatrix.push(graphComponentMatrix);
}