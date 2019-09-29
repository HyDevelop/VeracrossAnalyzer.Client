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
                axisLabel: {
                    interval: 0,
                    inside: false,
                    rotate: 60,

                    // Truncate text length
                    formatter: (value: string) => value.length <= 16 ? value : value.substr(0, 14) + '...'
                },
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value'
            },

            // Data
            series: [1, 2].map(i =>
            {
                return {
                    type: 'bar',
                    encode: {x: 0, y: i}
                }
            })
        };

        // TODO: Remove this
        console.log(settings);

        return settings;
    }
}
