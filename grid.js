let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let addressBarCont = document.querySelector(".address-bar");


for(let i = 0; i < rows; i++) {
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class","address-col");
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

for(let i = 0; i < cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class","address-row");
    addressRow.innerText = String.fromCharCode(65+i);
    addressRowCont.appendChild(addressRow);
}

let cellCont = document.querySelector(".cells-cont");
for(let i = 0; i < rows; i++) {
    let cellRowCont = document.createElement("div");
    cellRowCont.setAttribute("class","cell-row-cont");
    for(let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class","cell");
        cell.setAttribute("contenteditable","true");
        cell.setAttribute("spellcheck","false");

        // attributes for cell and storage identification
        cell.setAttribute("rid",i);
        cell.setAttribute("cid",j);

        cellRowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell,i,j);
    }
    cellCont.appendChild(cellRowCont);
}

function addListenerForAddressBarDisplay(cell, i , j) {
    cell.addEventListener("click", (e) => {
        let rowId = i+1;
        let colId = String.fromCharCode(65+j);
        addressBarCont.value = `${colId}${rowId}`; 
    })
}