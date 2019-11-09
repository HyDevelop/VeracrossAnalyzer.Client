import {Component, Prop, Vue} from 'vue-property-decorator';
import Course from '@/logic/course';
import {GPAUtils} from '@/logic/utils/gpa-utils';
import Constants from '@/constants';
import {FormatUtils} from '@/logic/utils/format-utils';

@Component({
})
export default class OverallBar extends Vue
{
    @Prop({required: true}) courses: Course[];

    /**
     * Generate settings
     */
    get chartSettings()
    {
        let settings =
        {
            // Title
            title:
            {
                show: true,
                textStyle:
                {
                    fontSize: 12
                },
                text: 'Course GPA',
                subtext: 'Current GPA for every course',
                x: 'center'
            },

            // X axis represents course names
            xAxis:
            {
                type: 'category',
                axisLabel: {
                    interval: 0,
                    inside: false,
                    rotate: 90,

                    // Truncate text length
                    formatter: (value: string) => FormatUtils.limit(value, 16)
                },
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value'
            },

            // Data
            series:
            [
                // Max GP
                {
                    type: 'bar',
                    barGap: '-100%',
                    data: this.courses.map(course =>
                    {
                        return {value: [course.name, GPAUtils.getGP(course, 'A+')], itemStyle: {color: '#d8d8d8'}}
                    }),
                },
                // Current GP
                {
                    type: 'bar',
                    barGap: '-100%',
                    data: this.generateGPData(),

                    label:
                    {
                        show: true,
                        rotate: 90
                    }
                }
            ],

            // Disable tooltip
            tooltip:
            {
                show: false
            }
        };

        return settings;
    }

    /**
     * Generate GP data for each course
     */
    private generateGPData()
    {
        let data: any = [];

        this.courses.forEach((course, index) =>
        {
            // Get GP
            let gp = GPAUtils.getGP(course, course.letterGrade);

            // No grade cases
            if (gp == -1) return;

            // Push data
            data.push(
            {
                value: [course.name, gp],
                itemStyle:
                {
                    color: Constants.THEME.colors[index]
                }
            });
        });

        return data;
    }
}
