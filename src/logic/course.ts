import JsonUtils from '@/logic/utils/json-utils';
import {FormatUtils} from '@/logic/utils/format-utils';
import {CourseUtils} from '@/logic/utils/course-utils';
import Navigation from '@/components/navigation/navigation';
import {GPAUtils} from '@/logic/utils/gpa-utils';
import CacheUtils from '@/logic/utils/cache-utils';

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

export interface AssignmentType
{
    id: number
    name: string

    weight: number
    scoreMax: number
    score: number
    percent: number
    assignmentCount: number
}

export interface Grading
{
    method: string
    weightingMap: {[index: string]: number}
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

    rawGrading: Grading[];

    computed:
    {
        termAssignments: Assignment[][]
        allYearGrade: number
    };

    cache: CacheUtils = new CacheUtils();

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

        this.rawGrading = new Array(4);
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
     * Get grading by term
     *
     * @param term
     */
    getGrading(term: number)
    {
        return this.rawGrading[term];
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
        if (this.assignments.length == 0) return false;

        // Skip if there are no grading scale
        // if (course.grading.method == 'NOT_GRADED') return;

        // Is graded
        return true;
    }

    /**
     * Get currently selected grading periods
     */
    get gradingPeriods(): number[]
    {
        let timeCode = Navigation.instance.getSelectedGradingPeriod();
        return timeCode == -1 ? [0, 1, 2, 3] : [timeCode];
    }

    /**
     * Get assignments of the selected time
     */
    get assignments(): Assignment[]
    {
        return this.gradingPeriods
            .flatMap(term => this.computed.termAssignments[term])
            .filter(a => a.complete == 'Complete');
    }

    /**
     * Get letter grade
     */
    get letterGrade(): string
    {
        return this.cache.get('LetterGrade', () =>
        {
            // Get scale
            let scale = GPAUtils.findScale(this.numericGrade);

            // Scale not found
            return scale == undefined ? '--' : scale.letter;
        })
    }

    /**
     * Get numeric grade
     */
    get numericGrade(): number
    {
        return this.cache.get('NumericGrade', () =>
        {
            // Calculate
            if (this.grading.method == 'PERCENT_TYPE')
            {
                return GPAUtils.getPercentTypeAverage(this, this.assignments);
            }
            else if (this.grading.method == 'TOTAL_MEAN')
            {
                return GPAUtils.getTotalMeanAverage(this.assignments);
            }
            else return -1;
        })
    }

    /**
     * Get assignment types
     */
    get assignmentTypes(): AssignmentType[]
    {
        return this.cache.get('AssignmentTypes', () =>
        {
            // Get all types
            let types = this.assignments.map(a => a.type);

            // Remove duplicates
            types = types.filter((type, i, a) => a.indexOf(type) == i);

            // Get total possible score for weight calculation
            let totalScoreMax = this.assignments.reduce((sum, a) => sum + a.scoreMax, 0);

            // For every type...
            return types.map(type =>
            {
                // Get assignments of the type
                let typeAssignments = this.assignments.filter(a => a.type == type);

                // Count scores and max scores
                let score = typeAssignments.reduce((sum, a) => sum + a.score, 0);
                let scoreMax = typeAssignments.reduce((sum, a) => sum + a.scoreMax, 0);

                // Calculate weight
                let weight = this.grading.method == 'PERCENT_TYPE'
                    ? this.grading.weightingMap[type] : scoreMax / totalScoreMax;

                // Return
                return {name: type, id: typeAssignments[0].typeId, weight: +(weight * 100).toFixed(2),
                    scoreMax: scoreMax, score: score, percent: +(score / scoreMax * 100).toFixed(2),
                    assignmentCount: typeAssignments.length}
            })
        })
    }
}
