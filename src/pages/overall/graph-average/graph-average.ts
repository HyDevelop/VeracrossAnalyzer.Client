import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
})
export default class GraphAverage extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    /**
     * Generate settings
     */
    get chartSettings()
    {
        let settings =
        {
            // Dataset
            dataset:
            {
                source: this.courses.map(course =>
                {
                    // [Course name, GPA, MaxGPA]
                    return [course.name, GPAUtils.getGP(course, course.letterGrade),
                        GPAUtils.getGP(course, 'A+')];
                })
            },

            // X axis represents course names
            xAxis:
            {
                type: 'category',
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value'
            },

            // Data
            series:
            [
                {
                    type: 'bar',
                    encode:
                    {
                        x: 0,
                        y: 1
                    }
                },
                {
                    type: 'bar',
                    encode:
                    {
                        x: 0,
                        y: 2
                    }
                }
            ]
        };

        // TODO: Remove this
        console.log(settings);

        return settings;
    }
}
