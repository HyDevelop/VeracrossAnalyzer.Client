import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import Constants from '@/constants';

@Component({
})
export default class OverallCourse extends Vue
{
    // @ts-ignore
    @Prop({required: true}) course: Course;

    private unread: number = -1;

    /**
     * Count the number of unread assignments with cache
     */
    countUnread(): number
    {
        if (this.unread == -1)
        {
            return this.unread = this.course.assignments.filter(a => a.unread).length;
        }
        else return this.unread;
    }

    unreadTable()
    {
        return [{date: '2019-10-04', name: 'Letter from a Penn Farmer Discussion Forum', grade: '14|14'}];
    }
}
