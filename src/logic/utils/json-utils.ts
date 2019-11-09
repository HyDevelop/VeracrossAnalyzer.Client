import {Assignment} from '@/logic/course';

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
        return assignments.assignments.map((assignment: any) =>
        {
            return {
                id: assignment.assignment_id,
                scoreId: assignment.score_id,
                type: assignment.assignment_type,
                typeId: assignment.assignment_type_id,
                description: assignment.assignment_description,
                date: new Date(assignment._date),
                complete: assignment.completion_status,
                include: assignment.include_in_calculated_grade == 1,
                display: assignment.display_grade == 1,

                unread: assignment.is_unread == 1,

                scoreMax: assignment.maximum_score,
                score: +assignment.raw_score,

                gradingPeriod: +assignment.grading_period.replace('Quarter ', '') - 1
            }
        });
    }
}
