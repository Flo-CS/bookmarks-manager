import {contextBridge, ipcRenderer} from 'electron'
import {APIRequestMessages} from "../src/helpers/api";


export const bridge = {
    sendMessage: <T extends keyof APIRequestMessages>(channel: T, ...params: APIRequestMessages[T]["params"]): Promise<APIRequestMessages[T]["result"]> => {
        return ipcRenderer.invoke(channel, ...params)
    },
}

contextBridge.exposeInMainWorld('bridge', bridge)

