export function loopNext<T>(arr: T[], elemToFind: T): T | null {
    if (arr.length <= 0) return null;
    const currentIndex = arr.findIndex((elem) => elem === elemToFind)
    if (currentIndex < 0) return arr[0];

    const nextIndex = (currentIndex + 1) % arr.length;
    return arr[nextIndex];
}

export function loopPrevious<T>(arr: T[], elemToFind: T): T | null {
    if (arr.length <= 0) return null;

    const currentIndex = arr.findIndex((elem) => elem === elemToFind)
    if (currentIndex - 1 < 0) return arr[arr.length - 1];

    const nextIndex = (currentIndex - 1) % arr.length;
    return arr[nextIndex];
}

