const { shell } = require("electron");

// DOM elements
const openAllBtn = document.getElementById("results-parameter-btn");
const downloadBtn = document.getElementById("results-parameter-img");
const totalHitCount = document.getElementById("total-hit-count");

const { dialogMessageArray } = require("../config/config.json");
const storeResults = require("./storeResults");

// Require modules
const { downloadBtnDialog } = require("./ipc");

const openAllFiles = (files) => {
    files.forEach(item => {
        shell.openPath(item);
    })
}

openAllBtn.addEventListener("click", e => {
    if (storeResults.filteredFilePaths.length)
        openAllFiles(storeResults.filteredFilePaths);
    else
        openAllFiles(storeResults.filePaths);
});

downloadBtn.addEventListener("click", e => {
    downloadBtnDialog(dialogMessageArray);
});

exports.setHitCount = (count) => {
    totalHitCount.innerText = count;
}