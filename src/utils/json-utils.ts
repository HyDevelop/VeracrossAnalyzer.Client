/**
 * Objects of this interface represent assignment grades.
 */
interface Grade
{
    type: string,
    description: string,
    date: string,
    complete: string,
    include: boolean,
    display: boolean,

    scoreMax: number,
    score: number
}

export default class JsonUtils
{
}
