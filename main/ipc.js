const { ipcMain } = require("electron");

const terminal = require("./terminal");
const dialog = require("./dialog");
const saveToExcel = require("./saveToExcel");

ipcMain.on("folder-clicked", (e, args) => {
    dialog.showDialog(args.defaultFolderPath)
        .then(ans => {
            if (args.from === "main")
                e.reply("answer-folder-clicked", ans.filePaths[0]);
            else
                e.reply("answer-folder-clicked-dialog", ans.filePaths[0]);
        })
});

ipcMain.on("show-error-dialog", (e, args) => {
    dialog.showErrorDialog(args);
});

ipcMain.on("open-item-in-editor", (e, args) => {
    terminal(args);
});

ipcMain.on("open-download-dialog", (e, args) => {
    dialog.showMessageDialog(args)
        .then(ans => {
            e.reply("answer-open-download-dialog", ans);
        })
});

ipcMain.on("download-items", (e, args) => {
    saveToExcel(args);
});
