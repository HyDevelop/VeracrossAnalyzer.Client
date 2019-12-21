import {Component, Prop, Vue} from 'vue-property-decorator';
import App from '@/components/app/app';
import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';
import Course, {Assignment} from '@/logic/course';

@Component({
    components: {UnreadEntry: AssignmentEntry, CourseHead}
})
export default class OverallCourse extends Vue
{
    @Prop({required: true}) course: Course;

    get unreadAssignments(): Assignment[]
    {
        return this.course.assignments.filter(a => a.unread);
    }

    get unread(): number
    {
        return this.unreadAssignments.length;
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
                // @ts-ignore
                this.unreadAssignments.find(a => a.id == response.data.assignment_id).unread = false;
            }
            else
            {
                // Show error message TODO: Show it properly
                alert(response.data)
            }
        })
    }
}
