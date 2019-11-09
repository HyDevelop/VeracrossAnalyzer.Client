import JsonUtils from '@/logic/utils/json-utils';
import {FormatUtils} from '@/logic/utils/format-utils';
import {CourseUtils} from '@/logic/utils/course-utils';
import Navigation from '@/components/navigation/navigation';
import {GPAUtils} from '@/logic/utils/gpa-utils';

/**
 * Objects of this interface represent assignment grades.
 */
export interface Assignment
{
    id: number
    scoreId: number
    type: string
    typeId: number
    description: string
    time: number
    complete: string
    include: boolean
    display: boolean

    unread: boolean

    scoreMax: number
    score: number

    gradingPeriod: number
}

export default class Course
{
    id: number;
    assignmentsId: number;
    name: string;
    teacherName: string;
    status: string;
    rawAssignments: Assignment[];

    rawLetterGrade?: string;
    rawNumericGrade?: number;

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

        this.rawLetterGrade = courseJson.letterGrade;
        this.rawNumericGrade = courseJson.numericGrade;

        // Other api issue
        if (this.rawLetterGrade == '')
        {
            this.rawNumericGrade = undefined;
            this.rawLetterGrade = undefined;
        }

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
        this.rawAssignments = JsonUtils.filterAssignments(data);

        // Sort by date (Latest is at 0)
        this.rawAssignments.sort((a, b) => b.time - a.time);

        // Filter assignments into terms
        let termAssignments: Assignment[][] = [[], [], [], []];
        let currentTerm = 0;

        // Loop through it by time order
        this.rawAssignments.forEach(a => termAssignments[a.gradingPeriod].push(a));

        // Set computed data
        this.computed = {termAssignments: termAssignments, allYearGrade: -1};
    }

    /**
     * Is graded or not
     */
    get isGraded(): boolean
    {
        // Skip future or past courses
        if (this.status != 'active') return false;

        // Skip courses without levels TODO: Ask for user input
        if (this.level == 'None' || this.level == 'Unknown' || this.scaleUp == -1) return false;

        // Skip courses without graded assignments
        if (this.gradedAssignments.length == 0) return false;

        // Skip if there are no grading scale
        // if (course.grading.method == 'NOT_GRADED') return;

        // Is graded
        return true;
    }

    /**
     * Get assignments of the selected time
     */
    get assignments(): Assignment[]
    {
        let timeCode = Navigation.instance.getSelectedGradingPeriod();

        // All year
        if (timeCode == -1)
        {
            return this.rawAssignments;
        }

        // Specific time
        return this.computed.termAssignments[timeCode];
    }

    /**
     * Get graded assignments
     */
    get gradedAssignments(): Assignment[]
    {
        return this.assignments.filter(a => a.complete == 'Complete');
    }

    // TODO: Optimize this
    private letterGradeComputed = false;

    /**
     * Get letter grade
     */
    get letterGrade(): string
    {
        // Cached
        if (this.rawLetterGrade != undefined && this.letterGradeComputed)
            return this.rawLetterGrade;
        this.letterGradeComputed = true;

        // Get scale
        let scale = GPAUtils.findScale(this.numericGrade);

        // Scale not found
        if (scale == undefined) return this.rawLetterGrade = '--';

        // Return
        return this.rawLetterGrade = scale.letter;
    }

    private numericGradeComputed = false;

    /**
     * Get numeric grade
     */
    get numericGrade(): number
    {
        // Cached
        if (this.rawNumericGrade != undefined && this.numericGradeComputed)
            return this.rawNumericGrade;
        this.numericGradeComputed = true;

        // Calculate
        if (this.grading.method == 'PERCENT_TYPE')
        {
            return this.rawNumericGrade = GPAUtils.getPercentTypeAverage(this, this.assignments);
        }
        if (this.grading.method == 'TOTAL_MEAN')
        {
            return this.rawNumericGrade = GPAUtils.getTotalMeanAverage(this.assignments);
        }

        // Error
        return -1;
    }
}
