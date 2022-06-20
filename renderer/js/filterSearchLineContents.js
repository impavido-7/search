// results 
const results = document.getElementById("results");

// Line contents search fields
const lineContentsInclude = document.getElementById("line-contents-include");
const lineContentsSearchStyle = document.getElementById("line-contents-search-style");
const lineContentsSearchFrom = document.getElementById("line-contents-search-from");

// Import modules
const generateHTML = require("./generateHTML");
const storeResults = require("./storeResults");
const { displayRespective } = require("./fileSearch");
const { seperator } = require("../config/config.json");

const initialize = (count) => {
    results.innerText = "";
    displayRespective(count);
}

const makeHTMLChanges = (object) => {
    initialize(Object.keys(object).length);
    storeResults.filteredLineSearchContents = object;
    if (Object.keys(object).length) {
        storeResults.filteredFilePaths = Object.keys(object);
    }
    generateHTML(object);
}

const searchLineContents = (array, searchKeyword, result = {}) => {
    const object = storeResults.lineSearchContents;
    array.forEach(item => {
        const lines = object[item];
        lines.forEach(lineContent => {
            if (lineContent.Content.toLowerCase().includes(searchKeyword.toLowerCase())) {
                if (!result[item]) {
                    result[item] = [];
                }
                if (result[item].indexOf(lineContent) === -1) {
                    result[item].push(lineContent);
                }
            }
        });
    });
    return result;
}

const setSearchedContents = (array) => {
    const object = storeResults.lineSearchContents, obj = {};
    array.forEach(item => {
        obj[item] = [];
        obj[item].push(...object[item]);
    });
    storeResults.searchedLineSearchContents = obj;
}

lineContentsInclude.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const searchContent = lineContentsInclude.value;
        const searchStyle = lineContentsSearchStyle.value; //  includeAll or includeAtleastOne
        const searchFrom = lineContentsSearchFrom.value; // filter or complete

        let splitContents = searchContent.trim().split(seperator);

        if (splitContents.length && splitContents[0].length) {
            let inputArray, result, obj = {};
            if (searchFrom === "filter" && storeResults.filteredFilePaths.length) {
                inputArray = storeResults.filteredFilePaths;
            }
            else {
                inputArray = storeResults.filePaths;
            }
            splitContents.forEach(item => {
                result = searchLineContents(inputArray, item, result);
            });
            if (searchStyle === "includeAll") {
                let keys = Object.keys(result);
                keys.forEach(item => {
                    const lineContents = result[item];
                    lineContents.forEach(content => {
                        const lineContent = content.Content;
                        let k;
                        for (k = 0; k < splitContents.length; k++) {
                            if (!lineContent.toLowerCase().includes(splitContents[k].toLowerCase())) {
                                break;
                            }
                        }
                        if (k === splitContents.length) {
                            if (!obj[item]) {
                                obj[item] = [];
                            }
                            obj[item].push(content);
                        }
                    });
                });
                result = obj;
            }
            storeResults.searchedLineSearchContents = result;
            makeHTMLChanges(result);
        }
        else {
            if (storeResults.filteredFilePaths.length) {
                initialize(storeResults.filteredFilePaths.length);
                generateHTML(storeResults.filteredFilePaths);
                setSearchedContents(storeResults.filteredFilePaths);
            }
            else {
                initialize(storeResults.filePaths.length);
                generateHTML(storeResults.filePaths);
                storeResults.searchedLineSearchContents = storeResults.lineSearchContents;
            }
        }
    }
});