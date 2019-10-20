import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';
import CourseScatter from '@/pages/course/course-scatter/course-scatter';

@Component({
    components: {CourseHead, CourseScatter}
})
export default class CoursePage extends Vue
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
