import {Assignment} from '@/components/app/app';

export default class Course
{
    assignmentsId: number;
    id: number;
    name: string;
    teacherName: string;
    status: string;

    letterGrade?: string;
    numericGrade?: number;

    level: string;
    scaleUp: number;
    assignments: Assignment[];

    grading:
    {
        method: string
        weightingMap: {[index: string]: number}
    };

    computed:
    {
        termAssignments: Assignment[][]
        allYearGrade: number
    };
}
