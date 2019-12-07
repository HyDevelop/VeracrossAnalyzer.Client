import Course from '@/logic/course';
import Navigation from '@/components/navigation/navigation';
import Constants from '@/constants';

const LEVEL_AP = {level: 'AP', scaleUp: 1};
const LEVEL_H = {level: 'H', scaleUp: 0.75};
const LEVEL_A = {level: 'A', scaleUp: 0.5};
const LEVEL_CP = {level: 'CP', scaleUp: 0.25};
const LEVEL_CLUB = {level: 'Club', scaleUp: -1};

const UNKNOWN_COURSE_LIST = new Map();
UNKNOWN_COURSE_LIST.set('Piano Masterclass', LEVEL_H);
UNKNOWN_COURSE_LIST.set('Multivariable Calculus with Differential Equations', LEVEL_H);
UNKNOWN_COURSE_LIST.set('Introduction to Algorithmic Thinking and Computational Technologies', LEVEL_A);
UNKNOWN_COURSE_LIST.set('Ceramics 1', LEVEL_CP);
UNKNOWN_COURSE_LIST.set('Ceramics 2', LEVEL_A);
UNKNOWN_COURSE_LIST.set('Sculpture', LEVEL_CP);
UNKNOWN_COURSE_LIST.set('Drawing', LEVEL_CP);
UNKNOWN_COURSE_LIST.set('Painting', LEVEL_CP);

export class CourseUtils
{
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
    static detectLevel(name: string)
    {
        // Common ones
        if (name.startsWith('AP')) return LEVEL_AP;
        if (name.endsWith(' H')) return LEVEL_H;
        if (name.endsWith(' A')) return LEVEL_A;
        if (name.endsWith(' CP')) return LEVEL_CP;
        if (name.startsWith('HS ')) return LEVEL_CLUB;
        if (name.startsWith('MS ')) return LEVEL_CLUB;

        // Uncommon ones
        let lower = name.toLowerCase();

        if (name.startsWith('Pre-AP')) return LEVEL_AP;
        if (lower.endsWith(' acc')) return LEVEL_A;
        if (name.endsWith('H')) return LEVEL_H;
        if (name.endsWith('A')) return LEVEL_A;
        if (name.endsWith('CP')) return LEVEL_CP;

        // Even more uncommon
        if (lower.includes('honors')) return LEVEL_H;
        if (lower.includes('accelerated')) return LEVEL_A;
        if (name.includes('Advanced')) return LEVEL_A;

        // Unknown course list
        if (UNKNOWN_COURSE_LIST.has(name)) return UNKNOWN_COURSE_LIST.get(name);

        // Really unknown
        return undefined;
    }

    /**
     * Get the begin date of the selected term
     */
    static getTermBeginDate()
    {
        let selected = Navigation.instance.getSelectedTerm();

        return selected == -1 ? Constants.TERMS[0] : Constants.TERMS[selected];
    }

    /**
     * Get the end date of the selected term
     */
    static getTermEndDate()
    {
        let selected = Navigation.instance.getSelectedTerm();

        return selected == -1 ? Constants.TERMS[4] : Constants.TERMS[selected + 1];
    }
}
