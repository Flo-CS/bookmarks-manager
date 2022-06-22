import {contextBridge, ipcRenderer} from 'electron'
import {APIRequestMessage} from "../src/helpers/api";


export const bridge = {
    sendMessage: <T extends keyof APIRequestMessage>(channel: T, ...params: APIRequestMessage[T]["params"]): Promise<APIRequestMessage[T]["result"]> => {
        return ipcRenderer.invoke(channel, ...params)
    },
}

contextBridge.exposeInMainWorld('bridge', bridge)

