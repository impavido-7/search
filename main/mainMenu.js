const { Menu } = require("electron");

module.exports = (createWindow, openModal) => {

    let template = [
        {
            label: "File",
            submenu: [
                {
                    label: "New Window",
                    accelerator: "CmdOrCtrl + N",
                    click: () => {
                        createWindow();
                    }
                },
                {
                    label: "Change Defaults",
                    accelerator: "CmdOrCtrl + D",
                    click: openModal
                },
                {
                    role: "close"
                }
            ]
        },
        {
            role: "editMenu"
        },
        {
            role: 'windowMenu'
        }
    ]

    // Create the Mac app menu
    if (process.platform === "darwin") {
        template.unshift({ role: "appMenu" })
    }

    // Build Menu
    const menu = Menu.buildFromTemplate(template);

    // Set as main app menu
    Menu.setApplicationMenu(menu);
}