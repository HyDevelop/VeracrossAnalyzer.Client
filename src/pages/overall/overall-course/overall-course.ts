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
}
