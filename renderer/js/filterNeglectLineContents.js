// results 
const results = document.getElementById("results");

// Line contents neglect field
const lineContentsNeglect = document.getElementById("line-contents-neglect");
const lineContentsNeglectStyle = document.getElementById("line-contents-neglect-style");
const lineContentsNeglectFrom = document.getElementById("line-contents-neglect-from");

const storeResults = require("./storeResults");
const generateHTML = require("./generateHTML");
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

const searchLineContents = (object, searchKeyword, result = {}) => {
    if (Object.keys(result).length) {
        object = { ...result };
        result = {};
    }
    const array = Object.keys(object);
    array.forEach(item => {
        const lines = object[item];
        lines.forEach(lineContent => {
            if (!(lineContent.Content.toLowerCase().includes(searchKeyword.toLowerCase()))) {
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

const getEntries = () => {
    if (Object.keys(storeResults.searchedLineSearchContents).length) {
        return storeResults.searchedLineSearchContents;
    }
    else if (storeResults.filteredFilePaths.length) {
        return storeResults.filteredFilePaths;
    }
    else {
        return storeResults.filePaths;
    }
}

const getLineContents = (array) => {
    const object = storeResults.lineSearchContents, obj = {};
    array.forEach(item => {
        obj[item] = [];
        obj[item].push(...object[item]);
    });
    return obj;
}

lineContentsNeglect.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const neglectContent = lineContentsNeglect.value;
        const searchStyle = lineContentsNeglectStyle.value; //  includeAll or includeAtleastOne
        const searchFrom = lineContentsNeglectFrom.value; // filter or complete

        let splitContents = neglectContent.trim().split(seperator);

        if (splitContents.length && splitContents[0].length) {
            let result, data = getEntries(), obj = {};
            if (Array.isArray(data)) {
                data = getLineContents(data);
            }
            if (searchStyle === "includeAtleastOne") {
                splitContents.forEach(item => {
                    if (searchFrom === "filter") {
                        splitContents.forEach(item => {
                            result = searchLineContents(data, item, result);
                        });
                    }
                    else {
                        result = searchLineContents(storeResults.lineSearchContents, item, result);
                    }
                });
            }
            else {
                let keys, inputData;
                if (searchFrom === "filter") {
                    keys = Object.keys(data);
                    inputData = data;
                }
                else {
                    keys = Object.keys(storeResults.lineSearchContents);
                    inputData = storeResults.lineSearchContents;
                }
                keys.forEach(item => {
                    const lineContents = inputData[item];
                    if (lineContents) {
                        lineContents.forEach(content => {
                            const lineContent = content.Content;
                            let k;
                            for (k = 0; k < splitContents.length; k++) {
                                if (!lineContent.toLowerCase().includes(splitContents[k].toLowerCase())) {
                                    break;
                                }
                            }
                            if (k < splitContents.length) {
                                if (!obj[item]) {
                                    obj[item] = [];
                                }
                                obj[item].push(content);
                            }
                        });
                    }
                });
                result = obj;
            }
            makeHTMLChanges(result);
        }
        else {

            if (Object.keys(storeResults.searchedLineSearchContents).length) {
                makeHTMLChanges(storeResults.searchedLineSearchContents);
            }
            else {
                makeHTMLChanges(storeResults.lineSearchContents);
            }
        }
    }
});
