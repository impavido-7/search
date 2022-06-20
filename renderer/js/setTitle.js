const { seperator } = require("../config/config.json");

// DOM Elements
const neglectFoldersDialog = document.getElementById("neglect-folders-dialog");
const neglectFolders = document.getElementById("neglect-folders");
const includeFilePath = document.getElementById("file-path-include");
const neglectFilePath = document.getElementById("file-path-neglect");
const lineContentsInclude = document.getElementById("line-contents-include");
const lineContentsNeglect = document.getElementById("line-contents-neglect");

const text = `You can enter multiple entries seperated by ${seperator}`;
const keypress = ` and then press enter`;

neglectFoldersDialog.title = text;
neglectFolders.title = text;
includeFilePath.title = text + keypress;
neglectFilePath.title = text + keypress;
lineContentsInclude.title = text + keypress;
lineContentsNeglect.title = text + keypress;