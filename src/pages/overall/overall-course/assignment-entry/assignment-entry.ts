import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment} from '@/components/app/app';
import moment from 'moment';

@Component({
})
export default class AssignmentEntry extends Vue
{
    @Prop({required: true}) assignment: Assignment;

    @Prop({default: false}) unread: boolean;

    /**
     * Format a date to the displayed format
     *
     * @param date Date
     */
    getMoment(date: string)
    {
        return moment(new Date(date));
    }

    /**
     * Mark this unread assignment as read
     */
    markAsRead()
    {
        // Call custom event
        this.$emit('mark-as-read', this.assignment)
    }
}
