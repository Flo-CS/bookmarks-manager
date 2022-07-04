import {bridge} from '../app/electron/bridge'

declare global {
    // eslint-disable-next-line
    interface Window {
        bridge: typeof bridge
    }
}

