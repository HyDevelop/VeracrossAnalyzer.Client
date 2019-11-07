
import Course from '@/logic/course';
import {Assignment} from '@/components/app/app';

export interface Scale
{
    min: number
    letter: string
    gp: number
}

/**
 * This is an utility class to calculate GPA.
 */
export class GPAUtils
{
    // [[Min score, Letter grade, Base GPA], ...]
    public static SCALE =
    [
        [96.5, 'A+', 4.00],
        [92.5, 'A' , 3.75],
        [89.5, 'A-', 3.50],
        [86.5, 'B+', 3.25],
        [82.5, 'B' , 3.00],
        [79.5, 'B-', 2.75],
        [76.5, 'C+', 2.50],
        [72.5, 'C' , 2.25],
        [70.5, 'C-', 2.00],
        [69.5, 'D' , 1.00],
        [0   , 'F' , 0.00]
    ];

    // Keywords
    public static MIN = 0;
    public static LETTER = 1;
    public static GPA = 2;

    /**
     * Calculate GPA for a list of couses
     *
     * @param coursesOriginal List of courses
     */
    public static getGPA(coursesOriginal: Course[]): {gpa: number, accurate: boolean, max: number}
    {
        // Clone array
        let courses: Course[] = [];

        // Accurate or not
        let accurate: boolean = true;

        // Remove all courses that does not have a grade
        coursesOriginal.forEach(course =>
        {
            if (course.letterGrade == null || course.letterGrade == '')
            {
                accurate = false;
            }
            else if (course.level != 'none')
            {
                courses.push(course);
            }
        });

        // If no course have grade, return -1
        if (courses.length == 0)
        {
            return {gpa: -1, accurate: false, max: -1};
        }

        // Count total GPA
        let totalGPA = 0;
        let maxTotal = 0;
        courses.forEach(course =>
        {
            totalGPA += this.getGP(course, course.letterGrade);
            maxTotal += this.getGP(course, 'A+');
        });

        // Get average GPA, round to two decimal places
        let gpa = Math.round(totalGPA / courses.length * 100) / 100;
        let maxGPA = Math.round(maxTotal / courses.length * 100) / 100;

        // Return results
        return {gpa: gpa, accurate: accurate, max: maxGPA};
    }

    /**
     * Calculate GPA for a course
     *
     * @param course Course
     * @param letterGrade Letter grade
     */
    public static getGP(course: Course, letterGrade?: string): number
    {
        // Find the GPA for this course.
        for (let scale of this.SCALE)
        {
            // Letter grades are the same
            if (scale[this.LETTER] == letterGrade)
            {
                // Get grade and add it
                let grade = <number> scale[this.GPA];

                // Add scaleUp if not failed.
                if (grade != 0) grade += course.scaleUp;

                // That's it
                return grade;
            }
        }

        return -1;
    }

    /**
     * Calculate the total-mean (total/max) average
     *
     * @param assignments
     */
    public static getTotalMeanAverage(assignments: Assignment[])
    {
        let score = 0;
        let max = 0;

        // Loop through assignments
        assignments.forEach(assignment =>
        {
            // If assignment should be displayed
            if (assignment.complete != 'Complete') return;

            // Record scores
            score += assignment.score;
            max += assignment.scoreMax;
        });

        // Return
        return score / max * 100;
    }

    /**
     * Calculate the percent type
     * TODO: Combine it with overall-line
     *
     * @param course
     * @param assignments
     */
    public static getPercentTypeAverage(course: Course, assignments: Assignment[])
    {
        let typeScores: {[index: string]: any} = {};
        let typeCounts: {[index: string]: any} = {};

        // Loop through assignments
        assignments.forEach(assignment =>
        {
            // If assignment should be displayed
            if (assignment.complete != 'Complete') return;

            // Record scores
            if (typeScores[assignment.type] == undefined) typeScores[assignment.type] = 0;
            typeScores[assignment.type] += assignment.score / assignment.scoreMax;

            if (typeCounts[assignment.type] == undefined) typeCounts[assignment.type] = 0;
            typeCounts[assignment.type] ++;
        });

        // Count total percentage (This is to avoid less than expected cases)
        // Eg. If HW = 25% and Quiz = 75%, I have 1 hw and 0 quiz
        // Without total percentage, the avg grade I get is 25%.
        let totalPercentage = 0;
        for (let type in course.grading.weightingMap)
        {
            if (typeScores[type] != undefined)
            {
                totalPercentage += course.grading.weightingMap[type];
            }
        }

        // Count
        let score = 0;
        for (let type in typeScores)
        {
            let typeFactor = course.grading.weightingMap[type] / totalPercentage;
            score += typeScores[type] * typeFactor / typeCounts[type];
        }

        // Add average to the row
        return score * 100;
    }
}
