import Course, {Assignment, Grading} from '@/logic/course';

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
    public static SCALE: Scale[] =
    [
        {min: 96.5, letter: 'A+', gp: 4.00},
        {min: 92.5, letter: 'A' , gp: 3.75},
        {min: 89.5, letter: 'A-', gp: 3.50},
        {min: 86.5, letter: 'B+', gp: 3.25},
        {min: 82.5, letter: 'B' , gp: 3.00},
        {min: 79.5, letter: 'B-', gp: 2.75},
        {min: 76.5, letter: 'C+', gp: 2.50},
        {min: 72.5, letter: 'C' , gp: 2.25},
        {min: 70.5, letter: 'C-', gp: 2.00},
        {min: 69.5, letter: 'D' , gp: 1.00},
        {min: 0   , letter: 'F' , gp: 0.00}
    ];

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
            else if (course.level != 'none' && !isNaN(course.numericGrade))
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
            totalGPA += this.getGP(course, course.numericGrade);
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
    public static getGP(course: Course, letterGrade: string | number): number
    {
        // Get scale
        let scale = this.findScale(letterGrade);

        // No scale
        if (scale == undefined) return -1;

        // Add scaleUp if not failed.
        return scale.gp == 0 ? 0 : scale.gp + course.scaleUp;

    }

    /**
     * Find the scale for a grade
     *
     * @param grade Letter grade or numeric grade
     */
    public static findScale(grade: string | number): Scale | undefined
    {
        // Letter grade
        if (typeof grade == 'string')
        {
            return this.SCALE.find(scale => scale.letter == grade);
        }

        // Numeric grade
        return this.SCALE.find(scale => grade >= scale.min);
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
            if (!assignment.graded) return;

            // Record scores
            score += assignment.score;
            max += assignment.scoreMax;
        });

        // Return
        return +(score / max * 100).toFixed(2);
    }

    /**
     * Calculate the percent type
     *
     * @param grading
     * @param assignments
     */
    public static getPercentTypeAverage(grading: Grading, assignments: Assignment[])
    {
        let typeScores: {[index: string]: any} = {};
        let typeCounts: {[index: string]: any} = {};

        // Loop through assignments
        assignments.forEach(assignment =>
        {
            // If assignment should be displayed
            if (!assignment.graded) return;

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
        for (let type in grading.weightingMap)
        {
            if (typeScores[type] != undefined)
            {
                totalPercentage += grading.weightingMap[type];
            }
        }

        // Count
        let score = 0;
        for (let type in typeScores)
        {
            let typeFactor = grading.weightingMap[type] / totalPercentage;
            score += typeScores[type] * typeFactor / typeCounts[type];
        }

        // Add average to the row
        return +(score * 100).toFixed(2);
    }

    /**
     * Get current school year
     */
    public static getSchoolYear(): number
    {
        // Get current year
        let currentYear = new Date().getFullYear();

        // Convert current year to current school year: +1 if it's after August
        if (new Date().getMonth() > 7) currentYear ++;

        return currentYear;
    }

    /**
     * Get grade level from graduation year
     *
     * @param graduationYear
     */
    public static getGradeLevel(graduationYear: number): number
    {
        // Calculate grade level
        return 12 - (graduationYear - this.getSchoolYear());
    }

    /**
     * Get grade level name from grade level. (Eg. Freshman, Sophomore, etc.)
     *
     * @param gradeLevel
     */
    public static gradeLevelName(gradeLevel: number): string
    {
        switch (gradeLevel)
        {
            case 9: return 'Freshman';
            case 10: return 'Sophomore';
            case 11: return 'Junior';
            case 12: return 'Senior';

            default: return 'Grade ' + gradeLevel;
        }
    }
}
