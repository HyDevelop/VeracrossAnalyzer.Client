import {Component, Prop, Vue} from 'vue-property-decorator';
import OverallLine from '@/pages/overall/overall-line/overall-line';
import OverallBar from '@/pages/overall/overall-bar/overall-bar';
import OverallCourse from '@/pages/overall/overall-course/overall-course';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
    components: {OverallLine, OverallBar, OverallCourse}
})
export default class CoursePage extends Vue
{
    // @ts-ignore
    @Prop({required: true}) course: Course;
}
