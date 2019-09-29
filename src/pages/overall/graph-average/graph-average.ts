import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
})
export default class GraphAverage extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    private settings =
    {
    };

    /**
     * Convert assignments list to a graph dataset.
     */
    get convertChart()
    {
        let courses = this.courses;

        // Make column list
        let columns = ['Course', 'GPA', 'MaxGPA'];

        // Calculate GPA and MaxGPA for each course (rows)
        let rows = courses.map(course =>
        {
            return {
                'Course': course.name,
                'GPA': GPAUtils.getGP(course, course.letterGrade),
                'MaxGPA': GPAUtils.getGP(course, 'A+')
            };
        });

    }
}
