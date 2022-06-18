const json2xls = require("json2xls");
const fs = require("fs");

const { showSaveDialog } = require("./dialog");

const getExcel = (data, folder) => {
    const array = Object.keys(data);
    let obj = [];
    for (let i = 0; i < array.length; i++) {
        let a = data[array[i]];
        for (let j = 0; j < a.length; j++) {
            let filename = array[i].replace(folder, "");
            obj.push({
                "File Name": filename[0] == "/" ? filename.slice(1) : filename,
                "Line": a[j].Line,
                "Code": a[j].Content.split("\r").join("")
            })
        }
    }
    return obj;
}

const saveExcel = (ans, xls) => {
    if (!ans.canceled) {
        try {
            fs.writeFileSync(ans.filePath, xls, "binary");
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = (args) => {
    const excelData = getExcel(args.data, args.folder);
    const xls = json2xls(excelData);
    showSaveDialog()
        .then(ans => saveExcel(ans, xls))
        .catch(console.log)
}