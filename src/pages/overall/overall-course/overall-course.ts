import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import Constants from '@/constants';
import UnreadEntry from '@/pages/overall/overall-course/unread-entry/unread-entry';

@Component({
    components: {UnreadEntry}
})
export default class OverallCourse extends Vue
{
    // @ts-ignore
    @Prop({required: true}) course: Course;

    private unread: number = -1;
    private unreadAssignments: Assignment[] = [];

    /**
     * Count the number of unread assignments with cache
     */
    countUnread(): number
    {
        if (this.unread == -1)
        {
            this.unreadAssignments = this.course.assignments.filter(a => a.unread);
            return this.unread = this.unreadAssignments.length;
        }
        else return this.unread;
    }
}
