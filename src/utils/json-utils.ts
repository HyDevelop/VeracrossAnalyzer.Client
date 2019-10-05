import {Assignment} from '@/components/app/app';

export default class JsonUtils
{
    /**
     * This method filters the information provided in an assignments json.
     *
     * @param assignments Assignments object
     * @returns Assignment[] Filtered assignment grade object list
     */
    public static filterAssignments(assignments: any): Assignment[]
    {
        let result: Assignment[] = [];

        assignments.assignments.forEach((assignment: any) =>
        {
            result.push(
            {
                id: assignment.assignment_id,
                type: assignment.assignment_type,
                description: assignment.assignment_description,
                date: assignment._date,
                complete: assignment.completion_status,
                include: assignment.include_in_calculated_grade == 1,
                display: assignment.display_grade == 1,

                unread: assignment.unread == 1,

                scoreMax: assignment.maximum_score,
                score: +assignment.raw_score
            });
        });

        return result;
    }
}
