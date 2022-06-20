// results 
const results = document.getElementById("results");

// File path search fields
const filePathInclude = document.getElementById("file-path-include");
const filePathNeglect = document.getElementById("file-path-neglect");
const filePathSearchFrom = document.getElementById("file-path-search-from");

// Import modules
const generateHTML = require("./generateHTML");
const storeResults = require("./storeResults");
const { displayRespective } = require("./fileSearch");
const { seperator } = require("../config/config.json");

const initialize = (count) => {
    results.innerText = "";
    displayRespective(count);
}

const makeHTMLChanges = (array) => {
    initialize(array.length);
    storeResults.filteredFilePaths = array;
    generateHTML(array);
}

const searchFilePath = (value, sortedArray, isSearch = false) => {
    const entries = value.trim().split(seperator);
    if (entries.length && entries[0].length) {
        for (let i = 0; i < entries.length; i++) {
            sortedArray = sortedArray.filter(item => !item.toLowerCase().includes(entries[i].toLowerCase()))
        }
        return sortedArray;
    }
    else {
        if (isSearch) {
            storeResults.searchedFilePaths = sortedArray;
        }
        makeHTMLChanges(sortedArray);
    }
}

filePathInclude.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        let sortedArray = searchFilePath(filePathInclude.value, storeResults.filePaths, true);
        if (sortedArray) {
            let filteredSortedArray = storeResults.filePaths.filter(item => !sortedArray.includes(item));
            storeResults.searchedFilePaths = filteredSortedArray;
            makeHTMLChanges(filteredSortedArray);
        }
    }
});

filePathNeglect.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        if (filePathSearchFrom.value === "filter") {
            let filteredSortedArray;
            if (storeResults.searchedFilePaths.length) {
                filteredSortedArray = searchFilePath(filePathNeglect.value, storeResults.searchedFilePaths);
            }
            else {
                filteredSortedArray = searchFilePath(filePathNeglect.value, storeResults.filePaths);
            }
            if (filteredSortedArray) {
                makeHTMLChanges(filteredSortedArray);
            }
        }
        else {
            let filteredSortedArray = searchFilePath(filePathNeglect.value, storeResults.filePaths);
            if (filteredSortedArray) {
                makeHTMLChanges(filteredSortedArray);
            }
        }
    }
});
