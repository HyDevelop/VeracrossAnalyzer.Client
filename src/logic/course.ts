import {Assignment} from '@/components/app/app';
import JsonUtils from '@/utils/json-utils';
import Constants from '@/constants';
import {FormatUtils} from '@/utils/format-utils';
import {CourseUtils} from '@/utils/course-utils';

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
        this.name = FormatUtils.parseText(courseJson.name).trim();
        this.teacherName = courseJson.teacherName;
        this.status = courseJson.status;

        this.letterGrade = courseJson.letterGrade;
        this.numericGrade = courseJson.numericGrade;

        // Level and scaleUp
        let level = CourseUtils.detectLevel(this.name);
        if (level != undefined)
        {
            this.level = level.level;
            this.scaleUp = level.scaleUp;
        }
        else this.level = 'Unknown';

        this.grading = courseJson.grading;
    }

    /**
     * Load in assignments data
     *
     * @param data Assignments data
     */
    loadAssignments(data: any)
    {
        // Load assignments
        // Parse json and filter it
        this.assignments = JsonUtils.filterAssignments(data);

        // Sort by date (Latest is at 0)
        this.assignments.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Filter assignments into terms
        let termAssignments: Assignment[][] = [[], [], [], []];
        let currentTerm = 0;

        // Loop through it by time order
        for (let i = this.assignments.length - 1; i >= 0; i--)
        {
            let a = this.assignments[i];

            // On to the next term
            if (currentTerm < 3 && a.date > Constants.TERMS[currentTerm + 1])
            {
                currentTerm ++;

                // Check again
                i++;
                continue;
            }

            // Push data
            termAssignments[currentTerm].push(a);
        }

        // Set computed data
        this.computed = {termAssignments: termAssignments, allYearGrade: -1};
    }
}
