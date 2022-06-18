// DOM elements
const selectFolder = document.getElementById("select-folder");
const toggleButton = document.getElementById("toggleButton");
const searchButton = document.getElementById("search");
const folderSelectedElement = document.getElementById("folder-selected");
const keyword = document.getElementById("keyword");

// Import modules
const ipc = require("./js/ipc");
const files = require("./js/fileSearch");

selectFolder.addEventListener("click", e => {
    e.preventDefault();
    ipc.folderSelect();
});

toggleButton.addEventListener("click", () => {
    if (toggleButton.value === "on") {
        toggleButton.value = "off";
    }
    else {
        toggleButton.value = "on";
    }
});

searchButton.addEventListener("click", () => {
    if (
        !folderSelectedElement.innerText ||
        folderSelectedElement.innerText === "No folder selected"
    ) {
        // Show folder empty error dialog
        ipc.showErrorDialog("Folder path can't be empty");
    }
    else if (!keyword.value) {
        // Show keyword is empty error dialog
        ipc.showErrorDialog("Search keyword can't be empty");
    }
    else {
        // Show spinner 
        ipc.showSpinner();

        // search for the keyword
        files.fileSearch();

        // Stop the spinner
        ipc.stopSpinner();
    }
});