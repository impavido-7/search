const { dialog } = require("electron");
const path = require("path");
const settings = require('electron-settings');

exports.showDialog = async (args) => {
    const dir = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath: args
    });
    return dir;
}

exports.showErrorDialog = (content) => {
    dialog.showErrorBox("Error", content);
}

exports.showMessageDialog = async (args) => {
    const answer = await dialog.showMessageBox({
        title: "Which list you want to download?",
        type: "question",
        message: "Please select an option",
        defaultId: 0,
        buttons: args
    });
    return answer;
}

exports.showSaveDialog = async () => {
    const answer = await dialog.showSaveDialog({
        title: "Select folder to save the list",
        defaultPath: path.join(__dirname, "../", "result.xlsx"),
        filters: [
            {
                name: 'Microsoft Excel Worksheet',
                extensions: ['xlsx']
            }
        ],
        buttonLabel: "Save"
    });
    return answer;
}

exports.showDefaultDialog = async (buttons) => {
    const answer = await dialog.showMessageBox({
        type: 'info',
        buttons,
        message: `It seems you haven't set the default configuration. 
                  Do you want to set it now?`,
        checkboxLabel: 'Never show this dialog again',
        checkboxChecked: false
    });
    return answer;
}