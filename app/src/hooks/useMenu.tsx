import {useMemo, useState} from "react";

interface MenuStatus {
    isOpened: boolean,
    position: {
        x: number,
        y: number
    }
}

export default function useMenu() {
    const [isMenuOpened, setIsMenuOpened] = useState<MenuStatus["isOpened"]>(false);
    const [position, setPosition] = useState<MenuStatus["position"]>({x: 0, y: 0});

    function openMenu(x: number, y: number): void {
        setIsMenuOpened(true)
        setPosition({x, y})
    }

    function closeMenu(): void {
        setIsMenuOpened(false)
    }


    const menuStatus = useMemo<MenuStatus>(() => {
        return {
            isOpened: isMenuOpened,
            position: position
        }
    }, [isMenuOpened, position]);

    return [menuStatus, openMenu, closeMenu] as const

}