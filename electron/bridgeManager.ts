import {ipcMain} from "electron";
import {ApiRequestHandler, ApiRequestsHandlers, ApiRequestsWithError} from "../src/helpers/api/Api";
import {ApiHandlers} from "./ApiHandlers";

export type APIHandlerBridgeWrapper<T extends keyof ApiRequestsWithError> = (event: Electron.IpcMainInvokeEvent, ...params: ApiRequestsWithError[T]["params"]) => Promise<ApiRequestsWithError[T]["result"]>

function wrapAPIHandler<T extends keyof ApiRequestsHandlers>(handler: ApiRequestHandler<T>): APIHandlerBridgeWrapper<T> {
    const wrapper = async (event: Electron.IpcMainInvokeEvent, ...args: Parameters<ApiRequestHandler<T>>) => {
        try {
            return await handler(...args)
        } catch (e) {
            return {
                "error": {
                    "message": e.message
                }
            }
        }
    }
    return wrapper
}

export async function setupBridgeHandlers() {
    for (const [channel, handler] of Object.entries<ApiRequestHandler<any>>(ApiHandlers)) {
        ipcMain.handle(channel, wrapAPIHandler(handler))
    }
}
