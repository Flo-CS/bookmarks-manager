import {RefObject, useEffect, useState} from 'react'

function useHover<T extends HTMLElement>(elementRef: RefObject<T>): boolean {
    const [value, setValue] = useState<boolean>(false)

    const handleMouseEnter = () => setValue(true)
    const handleMouseLeave = () => setValue(false)

    useEffect(() => {
        if (elementRef.current) {
            elementRef.current.addEventListener("mouseenter", handleMouseEnter)
            elementRef.current.addEventListener("mouseleave", handleMouseLeave)
        }
        return () => {
            elementRef.current?.removeEventListener("mouseenter", handleMouseEnter)
            elementRef.current?.removeEventListener("mouseleave", handleMouseLeave)
        };
    }, [elementRef]);

    return value
}


export default useHover