const fs = require("fs");
const path = require("path");

const { folderSelect } = require("./ipc");

// DOM nodes: Modal nodes
const modal = document.getElementById("modal");
const selectFolder = document.getElementById("select-folder-dialog");
const folderSelected = document.getElementById("folder-selected-dialog");
const searchKeyword = document.getElementById("keyword-dialog");
const neglectFolder = document.getElementById("neglect-folders-dialog");
const closeButton = document.getElementById("modal-close");
const saveButton = document.getElementById("modal-save");

// Main nodes
const keyword = document.getElementById("keyword");
const neglectFolders = document.getElementById("neglect-folders");
const folderSelectedElement = document.getElementById("folder-selected");

const config = require("../config/config.json");

// Set the default values
folderSelected.innerText = config.defaultFolderPath;
searchKeyword.value = config.defaultSearchKeyWord;
neglectFolder.value = config.defaultNeglectFolders.join(" ");

selectFolder.addEventListener("click", e => {
    e.preventDefault();
    folderSelect("dialog");
});

closeButton.addEventListener("click", e => {
    modal.style.display = "none";
});

saveButton.addEventListener("click", e => {
    folderSelectedElement.innerText = folderSelected.innerText;
    keyword.value = searchKeyword.value;
    neglectFolders.value = neglectFolder.value;
    closeButton.click();
    config.defaultFolderPath = folderSelected.innerText;
    config.defaultSearchKeyWord = searchKeyword.value.trim().split(" ")[0];
    const neglectFolderValue = neglectFolder.value.trim().split(" ");
    if (neglectFolderValue[0].length)
        config.defaultNeglectFolders = neglectFolderValue;
    fs.writeFileSync(path.join(__dirname, "../config/config.json"), JSON.stringify(config));
});