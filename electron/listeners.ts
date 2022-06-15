import {ipcMain} from "electron";
import {Bookmark} from "./models";

export async function registerListeners() {

    ipcMain.handle("getBookmarks", async () => {
        const bookmarks = await Bookmark.findAll();
        return bookmarks.map(bookmark => bookmark.get())
    })

    ipcMain.handle("addBookmark", async (event, bookmarkData) => {
        const bookmark = await Bookmark.create({
            ...bookmarkData
        }, {})
        return bookmark.get();
    })

    ipcMain.handle("updateBookmark", async (event, id: string, bookmarkData) => {
        await Bookmark.update({
            ...bookmarkData
        }, {
            where: {id: id}
        })

        const updatedBookmark = await Bookmark.findByPk(id);
        return updatedBookmark?.get();
    })

    ipcMain.handle("removeBookmark", async (event, id: string) => {
        await Bookmark.destroy({
            where: {id: id}
        })
    })

}
