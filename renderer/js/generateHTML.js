const { shell } = require("electron");

// DOM elements
const folderSelectedElement = document.getElementById("folder-selected");
const results = document.getElementById("results");
const editorPicked = document.getElementById("editor-picked");

// const { filePaths, lineSearchContents, filteredFilePaths, filteredLineSearchContents } = require("./storeResults");
const storeResults = require("./storeResults");

// Import modules
const { openItemInEditor } = require("./ipc");

const addAndRemoveStyle = (function () {
    let id;
    return function (selectedId) {
        if (document.getElementById(id)) {
            document.getElementById(id).classList.remove("itemSelectedClass");
        }
        id = selectedId;
        document.getElementById(id).classList.add("itemSelectedClass");
    }
})();

const openItem = (id, lineNumber, path) => {
    openItemInEditor(editorPicked.value, lineNumber, path);
    addAndRemoveStyle(id);
}

module.exports = (object) => {

    let array;
    if (Array.isArray(object)) {
        array = object;
        object = storeResults.lineSearchContents;
    }
    else {
        array = Object.keys(object);
    }

    array.forEach((item, i) => {

        const newElement = document.createElement("li");

        /* === create title block === */

        // create title container
        const titleContainerElement = document.createElement("div");
        titleContainerElement.classList.add("title-container");

        // create title element
        const titleElement = document.createElement("div");
        titleElement.classList.add("title");
        titleElement.setAttribute("id", `id_${i + 1}`);
        titleElement.innerText = item.replace(folderSelectedElement.innerText + "/", "");
        titleElement.addEventListener("click", e => {
            shell.openPath(item);
        });
        titleContainerElement.append(titleElement);

        // create hit-count element
        const hitElement = document.createElement("div");
        hitElement.classList.add("individual-count");
        hitElement.innerText = `Hits: ${object[item].length}`;
        titleContainerElement.append(hitElement);

        newElement.append(titleContainerElement);

        /* === create the line contents block === */
        object[item].forEach((content, j) => {
            const newChild = document.createElement("div");
            newChild.classList.add("linecontent-container");

            // create line number block
            const lineNumberElement = document.createElement("div");
            lineNumberElement.classList.add("line-number");
            lineNumberElement.innerText = `Line ${content.Line}`;
            newChild.append(lineNumberElement);

            // create the linecontent blocl
            const lineContentElement = document.createElement("div");
            lineContentElement.classList.add("line-content");
            lineContentElement.setAttribute("id", `id_${i + 1}_${j + 1}`);
            lineContentElement.innerText = content.Content;
            lineContentElement.addEventListener("click", e => {
                openItem(e.target.id, content.Line, item);
            });
            newChild.append(lineContentElement);

            newElement.append(newChild);

        });
        results.append(newElement);
    });
}