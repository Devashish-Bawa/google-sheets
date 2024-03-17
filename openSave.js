let downloadBtn = document.querySelector('.download');
let openBtn = document.querySelector('.open');


downloadBtn.addEventListener("click", (e)=>{
    let jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    let file = new Blob([jsonData], { type: "application/json" });

    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";
    a.click();
})


openBtn.addEventListener("click", (e)=>{
    //opens file explorer.
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change", (e)=> {
        let fileReader = new FileReader();
        let files = input.files;
        let fileObj = files[0];

        fileReader.readAsText(fileObj);
        fileReader.addEventListener("load", (e)=>{
            let readSheetData = JSON.parse(fileReader.result);
            
            // Basic sheet with default data will be created.
            addSheetBtn.click();

            //sheetDB , graphComponentMatrix will also be formed.
            sheetDB = readSheetData[0];
            graphComponentMatrix = readSheetData[1];
            collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
            collectedGraphComponentMatrix[collectedGraphComponentMatrix.length - 1] = graphComponentMatrix;

            handleSheetProperties();
        })

    })
});