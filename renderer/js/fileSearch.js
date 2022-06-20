const fs = require("fs");

// DOM elements
const toggleButton = document.getElementById("toggleButton");
const keyword = document.getElementById("keyword");
const neglectFolders = document.getElementById("neglect-folders");
const folderSelectedElement = document.getElementById("folder-selected");
const results = document.getElementById("results");
const noResults = document.getElementById("no-results");
const containResults = document.getElementById("results-container");

// Import the modules
const generateHTMLContent = require("./generateHTML");
const { setHitCount } = require("./resultParameters");
const { seperator } = require("../config/config.json");

const storeResults = require("./storeResults");

const initialize = () => {
    storeResults.filePaths = [];
    storeResults.lineSearchContents = {};
    storeResults.filteredFilePaths = [];
    storeResults.filteredLineSearchContents = {};
    storeResults.searchedFilePaths = [];
    storeResults.searchedLineSearchContents = {};

    // Delete the elements in results <ol>
    results.innerText = "";
}

const search = (content) => {
    if (toggleButton.value = "on") {
        if (content.includes(keyword.value)) {
            return true;
        }
        return false;
    }
    else {
        if (content.toLowerCase().includes(keyword.value.toLowerCase())) {
            return true;
        }
        return false;
    }
}

const searchLineContents = (path) => {
    const fileContents = fs.readFileSync(path, "utf-8");
    const lineContents = fileContents.split("\n");
    for (let i = 0; i < lineContents.length; i++) {
        if (search(lineContents[i])) {
            storeResults.lineSearchContents[path].push({
                Line: i + 1,
                Content: lineContents[i]
            })
        }
    }
}

const searchFileContents = (path) => {
    const fileContents = fs.readFileSync(path, "utf-8");
    if (search(fileContents)) {
        storeResults.filePaths.push(path);
        storeResults.lineSearchContents[path] = [];
        searchLineContents(path);
    }
}

// Traverse through all the folders and 
const searchKeyword = (folder) => {
    const elements = fs.readdirSync(folder);
    const foldersToBeNeglected = neglectFolders.value.trim().split(seperator);
    elements.forEach(element => {
        if (foldersToBeNeglected.indexOf(element) === -1) {
            const individual_path = folder + "/" + element;
            if (fs.lstatSync(individual_path).isDirectory()) {
                searchKeyword(individual_path);
            }
            else {
                searchFileContents(individual_path);
            }
        }
    });
}

exports.displayRespective = (length) => {
    if (length) {
        containResults.style.display = "block";
        noResults.style.display = "none";
        setHitCount(length);
    }
    else {
        containResults.style.display = "none";
        noResults.style.display = "flex";
    }
}

// Search the file contents
exports.fileSearch = () => {
    initialize();
    searchKeyword(folderSelectedElement.innerText);
    this.displayRespective(storeResults.filePaths.length);
    generateHTMLContent(storeResults.lineSearchContents);
}