import {FormatUtils} from '@/logic/utils/format-utils';
import {CourseUtils} from '@/logic/utils/course-utils';
import Navigation from '@/components/navigation/navigation';
import {GPAUtils} from '@/logic/utils/gpa-utils';
import CacheUtils from '@/logic/utils/cache-utils';
import Constants from '@/constants';
import {Index} from '@/logic/nav-controller';
import App from '@/components/app/app';

/**
 * Objects of this interface represent assignment grades.
 */
export class Assignment
{
    id: number;
    scoreId: number;
    type: string;
    typeId: number;
    description: string;
    time: number;
    complete: string;
    include: boolean;
    display: boolean;

    unread: boolean;

    scoreMax: number;
    score: number;

    gradingPeriod: number;

    // Callbacks when this object updates
    private updateCallbacks: (() => void)[] = [];

    /**
     * Construct assignment with json object
     *
     * @param json Json object
     */
    constructor(json: any)
    {
        this.id =  json.assignment_id;
        this.scoreId =  json.score_id;
        this.type =  json.assignment_type;
        this.typeId =  json.assignment_type_id;
        this.description =  json.assignment_description;
        this.time =  new Date(json._date).getTime();
        this.complete =  json.completion_status;
        this.include =  json.include_in_calculated_grade == 1;
        this.display =  json.display_grade == 1;

        this.unread =  json.is_unread == 1;

        this.scoreMax =  json.maximum_score;
        this.score =  +json.raw_score;

        this.gradingPeriod =  +json.grading_period.replace('Quarter ', '') - 1;
    }

    /**
     * Graded or not
     */
    get graded()
    {
        // TODO: Add more cases
        // Incomplete doesn't mean that the teacher didn't grade it yet, which is "Pending".
        // NREQ is not graded.
        return this.include && (this.complete == 'Complete' || this.complete == 'Late' || this.complete == 'Incomplete' || this.complete == 'Not Turned In');
    }

    /**
     * What is the problem with this assignment
     *
     * @return string Empty string if complete, otherwise return problem.
     */
    get problem()
    {
        switch (this.complete)
        {
            case 'Pending': return 'Pending'; // ID: 0
            case 'Not Turned In': return 'Not Turned In'; // ID: 1
            case 'Incomplete': return 'Incomplete'; // ID: 2
            case 'Complete': return ''; // ID: 3
            case 'NREQ': return 'Dropped'; // ID: 4
            case 'Late': return 'Late';
            default: return this.complete;
        }
    }

    /**
     * Get the text color of the problem
     */
    get problemColor()
    {
        switch (this.complete)
        {
            case 'Pending': return '#b1b1b1';
            case 'Not Turned In': return '#ff0036';
            case 'Incomplete': return '#ff7a2f';
            case 'NREQ': return '#41b141';
            case 'Late': return '#ff7a2f';
        }
    }

    /**
     * Add callback
     *
     * @param callback
     */
    addCallback(callback: () => void)
    {
        this.updateCallbacks.push(callback);
    }

    /**
     * Mark as read
     */
    markAsRead(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            App.http.post('/mark-as-read', {scoreId: this.scoreId})
            .then(response =>
            {
                // Check success
                if (response.success)
                {
                    this.unread = false;
                    this.updateCallbacks.forEach(callback => callback());
                    resolve();
                }
                else reject(response.data);
            })
            .catch(reject)
        })
    }
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

    graded: boolean
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

    termGrading: Grading[];
    termAssignments: Assignment[][];

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

        this.termGrading = new Array(4).fill(null);
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
        this.rawAssignments = data.assignments.map((a: any) => new Assignment(a));

        // Sort by date (Latest is at 0)
        this.rawAssignments.sort((a, b) => b.time - a.time);

        // Filter assignments into terms
        this.termAssignments = [[], [], [], []];

        // Loop through it by time order
        this.rawAssignments.forEach(a => this.termAssignments[a.gradingPeriod].push(a));
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
        return this.cache.get('GradingPeriods', () =>
        {
            return (this.rawSelectedTerm == -1 ? [0, 1, 2, 3] : [this.rawSelectedTerm]).filter(term =>
                this.termAssignments[term].filter(a => a.graded).length != 0);
        })
    }

    /**
     * Get currently selected grading periods
     */
    get allGradingPeriods(): number[]
    {
        return this.cache.get('AllGradingPeriods', () =>
        {
            return [0, 1, 2, 3].filter(term => this.termAssignments[term].filter(a => a.graded).length != 0);
        })
    }

    /**
     * Get assignments of the selected grading periods
     */
    get assignments(): Assignment[]
    {
        return this.gradingPeriods
            .flatMap(term => this.termAssignments[term])
            .sort((a, b) => b.time - a.time);
    }

    /**
     * Get assignments before a certain date
     *
     * @param time
     */
    getAssignmentsBefore(time: number): {term: number, assignments: Assignment[]}
    {
        let term = Constants.getTerm(new Date(time));
        let assignments = this.assignments.filter(a => a.gradingPeriod == term && a.time <= time);

        return {term: term, assignments: assignments}
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
     * Get letter grade by term
     *
     * @param term
     */
    letterGradeTerm(term: number): string
    {
        return this.cache.get('LetterGrade' + term, () =>
        {
            // Get scale
            let scale = GPAUtils.findScale(this.numericGradeTerm(term));

            // Scale not found
            return scale == undefined ? '--' : scale.letter;
        })
    }

    /**
     * Get numeric grade
     */
    get numericGrade()
    {
        return this.cache.get('NumericGrade', () =>
        {
            return this.gradingPeriods.map(term => this.numericGradeTerm(term))
                    .reduce((p, v) => p + v) / this.gradingPeriods.length
        })
    }

    /**
     * Get numeric grade by term
     *
     * @param term
     */
    numericGradeTerm(term: number): number
    {
        return this.cache.get('NumericGrade' + term, () =>
        {
            // Calculate
            if (this.termGrading[term].method == 'PERCENT_TYPE')
            {
                return GPAUtils.getPercentTypeAverage(this.termGrading[term], this.termAssignments[term]);
            }
            else if (this.termGrading[term].method == 'TOTAL_MEAN')
            {
                return GPAUtils.getTotalMeanAverage(this.termAssignments[term]);
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
                let typeAssignments = this.assignments.filter(a => a.graded && a.type == type);

                // Count scores and max scores
                let score = typeAssignments.reduce((sum, a) => sum + a.score, 0);
                let scoreMax = typeAssignments.reduce((sum, a) => sum + a.scoreMax, 0);

                // Calculate weight
                let weight = this.termGrading[0].method == 'PERCENT_TYPE'
                    ? this.termGrading[0].weightingMap[type] : scoreMax / totalScoreMax;

                // Return
                return {name: type, id: typeAssignments[0].typeId, weight: +(weight * 100).toFixed(2),
                    scoreMax: scoreMax, score: score, percent: +(score / scoreMax * 100).toFixed(2),
                    assignmentCount: typeAssignments.length}
            })
        })
    }

    /**
     * Get url hash code
     */
    get urlHash(): string
    {
        return `course/${this.id}`
    }

    /**
     * Get navigation index
     */
    get urlIndex(): Index
    {
        return {hash: this.urlHash, title: this.name, identifier: 'course', info: {id: this.id}}
    }

    /**
     * Selected term
     */
    get rawSelectedTerm(): number
    {
        return Navigation.instance.getSelectedTerm()
    }
}
