import {bridgeApi} from '../electron/bridge'

declare global {
    // eslint-disable-next-line
    interface Window {
        bridge: typeof bridgeApi
    }
}

