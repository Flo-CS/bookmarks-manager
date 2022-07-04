import {ipcMain} from "electron";
import {ApiErrorResult, ApiRequestHandler, ApiRequestsHandlers} from "../types/api";
import {ApiHandlers} from "./apiHandlers";
import {APIHandlerBridgeWrapper} from "../types/electron";

function wrapAPIRequestHandler<T extends keyof ApiRequestsHandlers>(handler: ApiRequestHandler<T>): APIHandlerBridgeWrapper<T> {
    const wrapper = async (event: Electron.IpcMainInvokeEvent, ...args: Parameters<ApiRequestHandler<T>>) => {
        try {
            return await handler(...args)
        } catch (e) {
            return {
                "error": {
                    "message": e.message
                }
            } as ApiErrorResult
        }
    }
    return wrapper
}

export async function setupBridgeHandlers() {
    for (const [channel, handler] of Object.entries<ApiRequestHandler<any>>(ApiHandlers)) {
        ipcMain.handle(channel, wrapAPIRequestHandler(handler))
    }
}
