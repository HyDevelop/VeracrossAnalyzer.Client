import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';

@Component({
})
export default class UnreadEntry extends Vue
{
    // @ts-ignore
    @Prop({required: true}) assignment: Assignment;
}
