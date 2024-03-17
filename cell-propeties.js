// storage
let collectedSheetDB = [] // storage for multiple sheets

let sheetDB = [];

// code to make by default sheet 1
{
    let addSheetBtn = document.querySelector('.sheet-add-icon');
    addSheetBtn.click();
}

/*
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
}*/

//selector for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGColor = document.querySelector(".BGColor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAligin = alignment[0] ;
let centreAlign = alignment[1] ;
let rightAlign = alignment[2] ;

let activeColorProp = "#dfe4ea";
let inactiveColorProp = "#f1f2f6";

let addressBar = document.querySelector(".address-bar");
//attach listner
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    //modification
    cellProp.bold = !cellProp.bold; // data change
    cell.style.fontWeight = cellProp.bold? "bold" : "normal"; //ui change 1
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // ui change 2
})

italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    //modification
    cellProp.italic = !cellProp.italic; // data change
    cell.style.fontStyle = cellProp.italic? "italic" : "normal"; //ui change 1
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // ui change 2
})

underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    //modification
    cellProp.underline = !cellProp.underline; // data change
    cell.style.textDecoration = cellProp.underline? "underline" : "none"; //ui change 1
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; // ui change 2
})

fontSize.addEventListener("change" , (e)=> {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    cellProp.fontSize = fontSize.value; //Data change
    //ui change 
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change" , (e)=> {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    cellProp.fontFamily = fontFamily.value; //Data change
    //ui change 1
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener("change", (e)=> {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

BGColor.addEventListener("change", (e)=> {
    let address = addressBar.value;
    let [cell,cellProp] =  activeCell(address);

    cellProp.BGColor = BGColor.value;
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
})

alignment.forEach((alignElem)=>{
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell,cellProp] =  activeCell(address);

        let alignValue = e.target.classList[0];
        //data change
        cellProp.alignment = alignValue;
        cell.style.textAlign = cellProp.alignment; // ui change 1

        switch(alignValue) { // ui change 2
            case "left" :
                leftAligin.style.backgroundColor = activeColorProp;
                centreAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center" :
                leftAligin.style.backgroundColor = inactiveColorProp;
                centreAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right" :
                leftAligin.style.backgroundColor = inactiveColorProp;
                centreAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    })
})

let allCells = document.querySelectorAll(".cell");
for(let i = 0 ; i < allCells.length; i++) {
    addListenerToAttachCellProperties (allCells[i]);
}
function addListenerToAttachCellProperties(cell) {
    //work
    cell.addEventListener("click",(e)=> {

        let address = addressBar.value;
        let[rid,cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        //apply cell properties
        cell.style.fontWeight = cellProp.bold? "bold" : "normal"; //ui change 1
        cell.style.fontStyle = cellProp.italic? "italic" : "normal"; //ui change 1
        cell.style.textDecoration = cellProp.underline? "underline" : "none"; //ui change 1
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
        cell.style.textAlign = cellProp.alignment; // ui change 1


        // apply properties to ui container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; // ui change 2
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; // ui change 2
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; // ui change 2
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGColor;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        switch(cellProp.alignment) { // ui change 2
            case "left" :
                leftAligin.style.backgroundColor = activeColorProp;
                centreAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center" :
                leftAligin.style.backgroundColor = inactiveColorProp;
                centreAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right" :
                leftAligin.style.backgroundColor = inactiveColorProp;
                centreAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

          
        let formulaBar = document.querySelector('.formula-bar');
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    })
}

function activeCell(address) {
    let [rid,cid] = decodeRIDCIDFromAddress(address);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp=sheetDB[rid][cid];
    return [cell,cellProp];
}

function getCellAndCellProp(address) {
    let [rid,cid] = decodeRIDCIDFromAddress(address);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp=sheetDB[rid][cid];
    return [cell,cellProp];
}

function decodeRIDCIDFromAddress(address) {
    let rid = Number(address.slice(1))-1;
    let cid = Number(address.charCodeAt(0)) - 65;
    return [rid,cid];
}