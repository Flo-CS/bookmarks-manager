export function isValidTag(tag: string) {
    return !tag.match(/^\s*$/); // Only spaces regex
}