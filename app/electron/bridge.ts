import {contextBridge, ipcRenderer} from 'electron'
import {ApiRequests} from "../types/api";

export const bridge = {
    async sendAPIRequest<T extends keyof ApiRequests>(channel: T, ...params: ApiRequests[T]["params"]): Promise<ApiRequests[T]["result"]> {
        const result = await ipcRenderer.invoke(channel, ...params)
        if (result && result.error) {
            throw new Error(result.error.message)
        }
        return result
    }
}

contextBridge.exposeInMainWorld('bridge', bridge)
