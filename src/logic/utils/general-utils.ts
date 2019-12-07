
export function findLastIndex<T>(array: T[], callback: (v: T) => boolean): number
{
    let arr2 = array.slice().reverse();
    let result = arr2.length - arr2.findIndex(callback);
    return result == -1 ? -1 : result - 1;
}
