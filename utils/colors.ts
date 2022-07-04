// TODO: To test and refactor
export function hexToRgba(originalHex: string, opacity = 1): string {
    let hex = originalHex.replace("#", "");

    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const hexMatches = hex.match(/\w\w/g);
    if (hexMatches?.length !== 3) return `rgba(0,0,0,${opacity})`;

    const [r, g, b] = hexMatches.map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${opacity})`;
}