const electron = require("electron");
const { app, Menu, crashReporter, BrowserWindow } = electron;
const path = require("path");
const MenuItem = electron.MenuItem;

let mainWindow = null;


//Auto Update App in background
require('update-electron-app')({
  repo: 'MorpheusWallet/beta',
  updateInterval: '10 minutes'
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    // titleBarStyle: "hidden",
    show: false,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#000",
    width: 1080,
    height: 800,
    minHeight: 730,
    maxHeight: 900,
    minWidth: 1080,
    maxWidth: 1440,
    icon: path.join(__dirname, "icons/png/64x64.png"),
    webPreferences: {
      webSecurity: false
    }
  });

  const template = [
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { type: "separator" },
      ]
    },
    {
      label: "View",
      submenu: [
        {
          role: "toggledevtools"
        },
        {
          role: "togglefullscreen"
        }
      ]
    },
    {
      role: "window",
      submenu: [
        {
          role: "minimize"
        },
        {
          role: "close"
        }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Learn More",
          click() {
            require("electron").shell.openExternal(
              "https://morpheuswallet.com/"
            );
          }
        }
      ]
    }
  ];

  if (process.platform === "darwin") {
    template.unshift({
      label: app.getName(),
      submenu: [
        {
          role: "about"
        },
        {
          type: "separator"
        },
        {
          role: "services",
          submenu: []
        },
        {
          type: "separator"
        },
        {
          role: "hide"
        },
        {
          role: "hideothers"
        },
        {
          role: "unhide"
        },
        {
          type: "separator"
        },
        {
          role: "quit"
        }
      ]
    });


    // Window menu
    template[3].submenu = [
      {
        role: "close"
      },
      {
        role: "minimize"
      },
      {
        role: "zoom"
      },
      {
        type: "separator"
      },
      {
        role: "front"
      }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  mainWindow.setMenu(null); // TODO: does this work?

  // load the local HTML file
  let url = require("url").format({
    protocol: "file",
    slashes: true,
    pathname: require("path").join(__dirname, "/dist/index.html")
  });
  mainWindow.loadURL(url);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

app.on("browser-window-created", function (event, win) {
  const ctxMenu = new Menu();
  ctxMenu.append(new MenuItem({ role: "copy" }));
  ctxMenu.append(new MenuItem({ role: "paste" }));
  ctxMenu.append(new MenuItem({ role: "selectall" }));
  ctxMenu.append(new MenuItem({ type: "separator" }));
  ctxMenu.append(new MenuItem({ role: "toggledevtools" }));
  ctxMenu.append(new MenuItem(
    {
      label: "Check for Update",
      click() {
        require("electron").shell.openExternal(
          "https://github.com/MorpheusWallet/beta/releases"
        );
      }
    }
  ));
  win.webContents.on("context-menu", function (e, params) {
    ctxMenu.popup(win, params.x, params.y)
  });
});
