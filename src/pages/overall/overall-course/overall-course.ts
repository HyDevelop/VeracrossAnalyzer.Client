import {Component, Prop, Vue} from 'vue-property-decorator';
import App, {Assignment, Course} from '@/components/app/app';
import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';

@Component({
    components: {UnreadEntry: AssignmentEntry, CourseHead}
})
export default class OverallCourse extends Vue
{
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

    /**
     * Mark an assignment as read
     */
    markAsRead(assignment: Assignment)
    {
        App.http.post('/mark-as-read', {scoreId: assignment.scoreId})
        .then(response =>
        {
            // Check success
            if (response.success)
            {
                this.unreadAssignments = this.unreadAssignments.filter(a => a != assignment);
                this.unread = this.unreadAssignments.length;
            }
            else
            {
                // Show error message TODO: Show it properly
                alert(response.data)
            }
        })
    }
}
