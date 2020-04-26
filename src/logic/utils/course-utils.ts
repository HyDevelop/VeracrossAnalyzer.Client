import Navigation from '@/components/navigation/navigation';
import Constants from '@/constants';
import {isNumeric} from '@/logic/utils/general-utils';

const LEVEL_AP = {level: 'AP', scaleUp: 1};
const LEVEL_H = {level: 'H', scaleUp: 0.75};
const LEVEL_A = {level: 'A', scaleUp: 0.5};
const LEVEL_CP = {level: 'CP', scaleUp: 0.25};
const LEVEL_CLUB = {level: 'Club', scaleUp: -1};

export class CourseUtils
{
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

    static getLevelID(level: string)
    {
        if (level == undefined) return -1;

        level = level.toLowerCase();

        if (level == 'ap' || level == 'advanced placement') return 1;
        if (level == 'h' || level == 'honors') return 2;
        if (level == 'a' || level == 'acc' || level == 'accelerated') return 3;
        if (level == 'cp' || level == 'college prep') return 4;

        if (level == 'club') return 101;
        if (level == 'sport') return 102;

        if (level == 'none') return 201;

        if (isNumeric(level)) return +level;

        return -1;
    }

    /**
     * Get full name of a level from short name
     *
     * @param level Any level name
     */
    static getLevelFullName(level: string)
    {
        switch (this.getLevelID(level))
        {
            case 1: return 'AP';
            case 2: return 'Honors';
            case 3: return 'Accelerated';
            case 4: return 'CP';
            case 101: return 'Club';
            case 102: return 'Sport';
            case 201: return 'None';
            default: return '--';
        }
    }
}
