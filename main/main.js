const { BrowserWindow, app, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");

const path = require("path");
const fs = require("fs");

// Import modules
require("./ipc");
const appMenu = require("./mainMenu");
const { showDefaultDialog } = require("./dialog");
const config = require("../renderer/config/config.json");

let mainWindow, spinnerWindow;

const openModal = () => {
    mainWindow.webContents.send("open-dialog");
}

// create the spinner browserWindow
const createSpinnerWindow = () => {
    spinnerWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        height: 200,
        width: 200,
        frame: false
    });
    spinnerWindow.setResizable(false);
    spinnerWindow.loadFile("spinner/index.html");
    spinnerWindow.on('closed', () => {
        spinnerWindow = null
    });
    spinnerWindow.once('ready-to-show', () => {
        spinnerWindow.show();
    });

    spinnerWindow.webContents.on("before-input-event", (event, input) => {
        event.preventDefault();
    });
}

// create a browserWindow
const createWindow = () => {

    const { screen } = require('electron');

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    let winState = windowStateKeeper({
        maximize: true
    });

    // create a new BrowserWindow
    mainWindow = new BrowserWindow({
        width: winState.width,
        height: height,
        minWidth: Math.round(width / 2),
        minHeight: Math.round(height * 0.9),
        maxHeight: height,
        icon: path.join(__dirname, "icon", "icon.png"),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the HTML file
    mainWindow.loadFile("renderer/index.html");

    // Manage the state
    winState.manage(mainWindow);

    // Open DevTools
    // mainWindow.webContents.toggleDevTools();

    mainWindow.webContents.on("did-finish-load", e => {
        setDefaultConfigs();
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// ipc for showing the spinner
ipcMain.on("show-spinner", e => {
    createSpinnerWindow();
});

// ipc for stoping the spinner
ipcMain.on("stop-spinner", e => {
    if (spinnerWindow) {
        spinnerWindow.close();
    }
});

// Show default dislog
const defaultResponse = (res, buttons) => {
    if (res.checkboxChecked) {
        const userDataPath = app.getPath("userData");
        const obj = {
            checkboxChecked: true
        }
        fs.writeFileSync(path.join(userDataPath, "appConfig.json"), JSON.stringify(obj));
    }
    if (buttons[res.response] === "Yes") {
        openModal();
    }
}

const defaultValueSetDialog = () => {
    const buttons = ['Yes', 'Not Now'];
    showDefaultDialog(buttons)
        .then((res) => defaultResponse(res, buttons))
        .catch(console.log)
}

const showMessageDialog = () => {

    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "config.json");

    if (fs.existsSync(configPath)) {
        const contents = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        const { defaultFolderPath, defaultSearchKeyWord, defaultNeglectFolders } = contents;

        if (
            (defaultFolderPath.length === 0 || defaultFolderPath == "No folder selected") &&
            (defaultSearchKeyWord.length === 0) &&
            (defaultNeglectFolders.length === 0)
        ) {
            const userDataPath = app.getPath("userData");
            const configPath = path.join(userDataPath, "appConfig.json");
            if (fs.existsSync(configPath)) {
                const contents = fs.readFileSync(configPath, "utf-8");
                if (!JSON.parse(contents).checkboxChecked) {
                    defaultValueSetDialog();
                }
            }
            else {
                defaultValueSetDialog();
            }
        }
    }
    else {
        defaultValueSetDialog();
    }
}

const setDefaultConfigs = () => {
    // Set the initial config
    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "config.json");
    mainWindow.webContents.send("set-configs", configPath);
}

// Electron app is ready
app.on("ready", () => {
    createWindow();
    appMenu(createWindow, openModal);
    showMessageDialog();
});

// Quite the app when all windows are closed
app.on("windows-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow 
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});