const { ipcRenderer } = require("electron");

// DOM nodes
const folderSelectedElement = document.getElementById("folder-selected");
const folderSelectedDialog = document.getElementById("folder-selected-dialog");
const modal = document.getElementById("modal");

// Import modules
const config = require("../config/config.json");

ipcRenderer.on("answer-folder-clicked-dialog", (e, arg) => {
    if (arg)
        folderSelectedDialog.innerText = arg;
    else
        folderSelectedDialog.innerText = "No folder selected";
});

ipcRenderer.on("answer-folder-clicked", (e, arg) => {
    if (arg)
        folderSelectedElement.innerText = arg;
    else
        folderSelectedElement.innerText = "No folder selected";
});

ipcRenderer.on("answer-open-download-dialog", (e, args) => {
    const ans = args.response;
    let object;
    if (config.dialogMessageArray[ans] === "Cancel") {
        return;
    }
    else if (config.dialogMessageArray[ans] === "Complete List") {
        object = require("./storeResults").lineSearchContents;
    }
    else if (config.dialogMessageArray[ans] === "Filtered List") {
        object = require("./storeResults").filteredLineSearchContents;
    }
    ipcRenderer.send("download-items", {
        data: object,
        folder: folderSelectedElement.innerText
    });
});

ipcRenderer.on("open-dialog", e => {
    modal.style.display = "flex";
});

exports.folderSelect = (from = "main") => {
    const defaultFolderPath = config.defaultFolderPath;
    ipcRenderer.send("folder-clicked", {
        defaultFolderPath,
        from
    });
}

exports.showErrorDialog = (text) => {
    ipcRenderer.send("show-error-dialog", text);
}

exports.showSpinner = () => {
    ipcRenderer.send("show-spinner");
}

exports.stopSpinner = () => {
    ipcRenderer.send("stop-spinner");
}

exports.openItemInEditor = (editor, lineNumber, path) => {
    const obj = {
        editor,
        lineNumber,
        path
    };
    ipcRenderer.send("open-item-in-editor", obj);
}

exports.downloadBtnDialog = (args) => {
    ipcRenderer.send("open-download-dialog", args);
}