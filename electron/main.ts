import { app, BrowserWindow, ipcMain } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
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

const fakeBookmarks = [{
  variant: "preview" as const,
  linkTitle: "This is a title",
  id: "1",
  url: "https://google.com",
  previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  description: "Google, moteur de recherche",
  tags: ["tag1", "tag2"],
  collection: "%WITHOUT_FOLDER%",
  modificationDate: new Date("2022-02-14T08:00:00"),
  creationDate: new Date("2022-02-14T08:00:00"),
}, {
  variant: "preview" as const,
  linkTitle: "This is a title",
  id: "2",
  url: "https://google.com",
  previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  description: "Google, moteur de recherche",
  tags: ["tag1", "tag2"],
  collection: "%WITHOUT_FOLDER%",
  modificationDate: new Date("2022-12-14T08:00:00"),
  creationDate: new Date("2022-12-14T08:00:00"),
}, {
  variant: "preview" as const,
  linkTitle: "This is a title",
  id: "3",
  url: "https://google.com",
  previewPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  faviconPath: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
  description: "Google, moteur de recherche",
  tags: ["tag1", "tag2"],
  collection: "%WITHOUT_FOLDER%",
  modificationDate: new Date("2021-01-14T08:00:00"),
  creationDate: new Date("2021-01-14T08:00:00"),
}, {
  variant: "icon" as const,
  linkTitle: "This is a title",
  id: "4",
  url: "https://google.com",

  description: "Google, moteur de recherche",
  tags: ["tag1", "tag2"],
  collection: "%WITHOUT_FOLDER%",
  modificationDate: new Date("2022-01-14T08:00:00"),
  creationDate: new Date("2022-01-14T08:00:00"),
}]

async function registerListeners() {
  ipcMain.handle("getBookmarks", () => {
    return fakeBookmarks;
  })

  ipcMain.handle("addBookmark", (event, bookmarkData) => {
    fakeBookmarks.push(bookmarkData);
  })

  ipcMain.handle("updateBookmark", (event, id, bookmarkData) => {
    const index = fakeBookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      fakeBookmarks[index] = { ...fakeBookmarks[index], ...bookmarkData };
    }
    return fakeBookmarks[index]
  })

  ipcMain.handle("removeBookmark", (event, id) => {
    const index = fakeBookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      fakeBookmarks.splice(index, 1);
    }
  })

}

app.on('ready', createWindow)
  .whenReady()
  .then(async () => {
    await registerListeners()
    await installExtension(REACT_DEVELOPER_TOOLS)
  })
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})