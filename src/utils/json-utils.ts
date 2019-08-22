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
    /**
     * This method filters the information provided in an assignments json.
     *
     * @param assignments Assignments object
     * @returns Grade[] Filtered assignment grade object list
     */
    public static filterAssignments(assignments: any): Grade[]
    {
        let result: Grade[] = [];

        assignments.assignments.forEach((assignment: any) =>
        {
            result.push(
            {
                type: assignment.assignment_type,
                description: assignment.assignment_description,
                date: assignment._date,
                complete: assignment.complete_status,
                include: assignment.include_in_calculated_grade == 1,
                display: assignment.display_grade == 1,

                scoreMax: assignment.maximum_score,
                score: +assignment.raw_score
            });
        });

        return result;
    }
}
