import {Course} from '@/components/app/app';

const LEVEL_AP = {level: 'AP', scaleUp: 1};
const LEVEL_H = {level: 'H', scaleUp: 0.75};
const LEVEL_A = {level: 'A', scaleUp: 0.5};
const LEVEL_CP = {level: 'CP', scaleUp: 0.25};
const LEVEL_CLUB = {level: 'Club', scaleUp: -1};

const UNKNOWN_COURSE_LIST =
{
    'Piano Masterclass': LEVEL_H,
    'Multivariable Calculus with Differential Equations': LEVEL_H,
    'Introduction to Algorithmic Thinking and Computational Technologies': LEVEL_A,
    'Ceramics 1': LEVEL_CP,
    'Ceramics 2': LEVEL_A,
    'Sculpture': LEVEL_CP,
    'Drawing': LEVEL_CP,
    'Painting': LEVEL_CP
};

export class CourseUtils
{
    /**
     * Return a list of courses that are graphed
     *
     * @param original Original course list
     * @return Course[] Filtered course list
     */
    public static getGradedCourses(original: Course[]): Course[]
    {
        // Define result
        let result: Course[] = [];

        // Filter through courses
        original.forEach(course =>
        {
            // Skip future or past courses
            if (course.status != 'active') return;

            // Skip courses without levels
            if (course.level == 'None') return;

            // Skip courses without graded assignments
            if (course.assignments.filter(a => a.complete == 'Complete').length == 0) return;
            
            // Skip if there are no grading scale
            // if (course.grading.method == 'NOT_GRADED') return;

            // Add it to the list
            result.push(course);
        });

        return result;
    }

    /**
     * Format course to tab index string
     *
     * @param course Course object
     * @return string Tab index
     */
    public static formatTabIndex(course: Course): string
    {
        return `course/${course.id}/${course.name.toLowerCase().split(' ').join('-')}`;
    }
    /**
     * Detect course level based on course name
     *
     * @param name Course name
     */
    private static detectLevel(name: string)
    {
        // Common ones
        if (name.startsWith('AP')) return LEVEL_AP;
        if (name.endsWith(' H')) return LEVEL_H;
        if (name.endsWith(' A')) return LEVEL_A;
        if (name.endsWith(' CP')) return LEVEL_CP;

        // Uncommon ones
        let lower = name.toLowerCase();

        if (lower.startsWith('pre-ap')) return LEVEL_AP;
        if (lower.endsWith(' acc')) return LEVEL_A;
        if (name.endsWith('H')) return LEVEL_H;
        if (name.endsWith('A')) return LEVEL_A;
        if (name.endsWith('CP')) return LEVEL_CP;

        // Even more uncommon
        if (lower.includes('honors')) return LEVEL_H;
        if (lower.includes('accelerated')) return LEVEL_A;
        if (name.includes('Advanced')) return LEVEL_A;
    }
}
