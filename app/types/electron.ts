import {ApiRequestsWithError} from "./api";

export type APIHandlerBridgeWrapper<T extends keyof ApiRequestsWithError> = (event: Electron.IpcMainInvokeEvent, ...params: ApiRequestsWithError[T]["params"]) => Promise<ApiRequestsWithError[T]["result"]>

