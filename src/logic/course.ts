import {Assignment} from '@/components/app/app';

export default class Course
{
    id: number;
    assignmentsId: number;
    name: string;
    teacherName: string;
    status: string;
    assignments: Assignment[];

    letterGrade?: string;
    numericGrade?: number;

    level: string;
    scaleUp: number;

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

    /**
     * Construct a course with a course json object
     *
     * @param courseJson Course json object
     */
    constructor(courseJson: any)
    {
        this.id = courseJson.id;
        this.assignmentsId = courseJson.assignmentsId;
        this.name = courseJson.name;
        this.teacherName = courseJson.teacherName;
        this.status = courseJson.status;
        this.assignments = courseJson.assignments;

        this.letterGrade = courseJson.letterGrade;
        this.numericGrade = courseJson.numericGrade;

        this.level = courseJson.level;
        this.scaleUp = courseJson.scaleUp;

        this.grading = courseJson.grading;
    }
}
