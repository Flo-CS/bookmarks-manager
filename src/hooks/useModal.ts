import {useMemo, useState} from "react";

export default function useModal<T>() {
    const [data, setData] = useState<T | undefined>(undefined);

    function closeModal() {
        setData(undefined);
    }

    function openModal(data: T) {
        setData(data);
    }

    const isOpen = useMemo(() => {
        return data !== undefined;
    }, [data])

    return [isOpen, data, openModal, closeModal] as const
}