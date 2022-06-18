// DOM elements
const keyword = document.getElementById("keyword");
const neglectFolders = document.getElementById("neglect-folders");
const folderSelectedElement = document.getElementById("folder-selected");

// Requiring the config
const config = require("../config/config.json");

/* Setting the values */

// Set the default path
folderSelectedElement.innerText = config.defaultFolderPath || "No folder selected";

// Set the default search-keyword
keyword.value = config.defaultSearchKeyWord;

// Set the neglectFolders content from the config
neglectFolders.value = config.defaultNeglectFolders.join(" ");