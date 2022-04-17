import { contextBridge, ipcRenderer } from 'electron'

export const api = {
    sendMessage: (channel: string, ...params: any[]) => {
        return ipcRenderer.invoke(channel, ...params)
    },
}

contextBridge.exposeInMainWorld('Main', api)
