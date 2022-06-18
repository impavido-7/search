const fs = require("fs");

// DOM elements
const keyword = document.getElementById("keyword");
const neglectFolders = document.getElementById("neglect-folders");
const folderSelectedElement = document.getElementById("folder-selected");
const folderSelected = document.getElementById("folder-selected-dialog");
const searchKeyword = document.getElementById("keyword-dialog");
const neglectFolder = document.getElementById("neglect-folders-dialog");

// Requiring the config
const config = require("../config/config.json");
const modal = require("./modal");

/* Setting the values */
module.exports = (args) => {

    if (fs.existsSync(args)) {
        const contents = JSON.parse(fs.readFileSync(args, "utf-8"));

        // Set config
        config.defaultFolderPath = contents.defaultFolderPath;
        config.defaultSearchKeyWord = contents.defaultSearchKeyWord;
        config.defaultNeglectFolders = contents.defaultNeglectFolders;

        // Set the default values for modal
        folderSelected.innerText = config.defaultFolderPath || "No folder selected";
        searchKeyword.value = config.defaultSearchKeyWord;
        neglectFolder.value = config.defaultNeglectFolders.join(" ");

        // Set the default values for main page
        folderSelectedElement.innerText = config.defaultFolderPath || "No folder selected";
        keyword.value = config.defaultSearchKeyWord;
        neglectFolders.value = config.defaultNeglectFolders.join(" ");

        // Send the folder path to modal.js
        modal.setFolderPath = args;

    }
}
