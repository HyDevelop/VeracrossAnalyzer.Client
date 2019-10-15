import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';

@Component({
    components: {CourseHead}
})
export default class CoursePage extends Vue
{
    // @ts-ignore
    @Prop({required: true}) course: Course;
}
