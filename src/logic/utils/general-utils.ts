
export function findLastIndex<T>(array: T[], callback: (v: T) => boolean): number
{
    let arr2 = array.slice().reverse();
    return arr2.length - arr2.findIndex(callback);
}
