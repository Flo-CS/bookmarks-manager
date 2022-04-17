import { contextBridge, ipcRenderer } from 'electron'

export const api = {
    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.Main.sendMessage`
     */

    sendMessage: (channel: string, ...params: any[]) => {
        return ipcRenderer.invoke('message', params)
    },
}

contextBridge.exposeInMainWorld('Main', api)
