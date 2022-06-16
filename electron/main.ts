import {app, BrowserWindow} from 'electron'
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {registerBridgeListeners} from './listeners';
import * as path from "path";

let mainWindow: BrowserWindow | null
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

export const assetsPath =
    process.env.NODE_ENV === 'production'
        ? process.resourcesPath
        : app.getAppPath()


function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(assetsPath, 'assets', 'icon.png'),
        width: 1100,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
    })

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
    .whenReady()
    .then(async () => {
        await registerBridgeListeners()
        await installExtension(REACT_DEVELOPER_TOOLS)
    })
    .catch(e => console.error(e))

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

