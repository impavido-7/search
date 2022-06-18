const { exec } = require("child_process");

const { showErrorDialog } = require("./dialog");

const cmd = (cmdLine, editor) => {
    exec(cmdLine, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            showErrorDialog(`You don't have ${editor} installed or haven't added it's path to the PATH environment variable`)
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports = (args) => {
    let str, editor;
    if (args.editor == "code") {
        str = `code --goto ${args.path}:${args.lineNumber}`;
        editor = "VS Code";
    }
    else if (args.editor == "notepad++") {
        str = `notepad++ "${args.path}" -n${args.lineNumber}`;
        editor = "Notepad++";
    }
    else if (args.editor == "atom") {
        str = `atom ${args.path}:${args.lineNumber}`;
        editor = "Atom";
    }
    cmd(str, editor);
}