import {contextBridge, ipcRenderer} from 'electron'

export const bridgeApi = {
    sendMessage: (channel: string, ...params: any[]) => {
        return ipcRenderer.invoke(channel, ...params)
    },
}

contextBridge.exposeInMainWorld('bridge', bridgeApi)
