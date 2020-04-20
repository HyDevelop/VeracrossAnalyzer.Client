
export function findLastIndex<T>(array: T[], callback: (v: T) => boolean): number
{
    let arr2 = array.slice().reverse();
    let result = arr2.findIndex(callback);
    return result == -1 ? -1 : arr2.length - result - 1;
}

export function isNumeric(str: string)
{
    return !isNaN(parseFloat(str)) && isFinite(+str);
}
