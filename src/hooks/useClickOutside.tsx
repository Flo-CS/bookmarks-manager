import {RefObject, useEffect} from 'react'

function useClickOutside<T extends HTMLElement>(elementRef: RefObject<T>, callback: () => void) {
    useEffect(() => {
        const listenerFn = (e: MouseEvent | TouchEvent) => {
            if (!elementRef.current || elementRef.current.contains(e.target as Node)) {
                return;
            }
            callback()
        }
        window.addEventListener("mousedown", listenerFn)
        window.addEventListener("touchstart", listenerFn)

        return () => {
            window.removeEventListener("mousedown", listenerFn)
            window.removeEventListener("touchstart", listenerFn)
        };
    }, [elementRef, callback]);
}


export default useClickOutside