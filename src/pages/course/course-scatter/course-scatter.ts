import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {FormatUtils} from '@/logic/utils/format-utils';
import moment from 'moment';
import Course, {Assignment} from '@/logic/course';
import GraphUtils from '@/logic/utils/graph-utils';
import {CourseUtils} from '@/logic/utils/course-utils';

@Component({
})
export default class CourseScatter extends Vue
{
    @Prop({required: true}) course: Course;

    /**
     * Override options
     *
     * @param options Original options (Unused)
     */
    afterConfig(options: any)
    {
        return this.chartSettings;
    }

    /**
     * Generate settings
     */
    get chartSettings()
    {
        // Create settings
        let settings =
        {
            // Base settings
            ...GraphUtils.getBaseSettings('Assignments', 'Assignment scores for ' + this.course.name),

            // X axis represents course names
            xAxis:
            {
                type: 'time',
                axisLabel:
                {
                    formatter: (name: any) => moment(name).format('MMM DD')
                },
                max: new Date().getTime()
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value',
                name: 'Percentage Score',
                nameLocation: 'center',
                nameGap: 38,
                axisLabel:
                {
                    formatter: (name: any) => name + '%'
                },
                min: (value: any) => Math.floor(value.min) - 5,
                max: (value: any) => Math.min(Math.ceil(value.max), 110)
            },

            // Tooltip
            tooltip:
            {
                trigger: 'axis',
                axisPointer:
                {
                    type: 'cross'
                },
                formatter: (ps: any[]) => moment(ps[0].data[0]).format('MMM DD, YYYY') + '<br>' + ps.map(p =>
                    `${GraphUtils.DOT.replace('{color}', p.color)}
                    ${FormatUtils.limit(p.data[2].description, 22)}: ${p.data[1]}%<br>`).join('')
            },

            // Legend
            legend:
            {
                bottom: 24,
                itemWidth: 14,
                textStyle:
                {
                    color: '#777',
                    fontSize: 11
                }
            },

            // Data
            series: this.series()
        };

        return settings;
    }

    /**
     * Get series data
     */
    private series()
    {
        // Scatter data point style
        let itemStyle =
        {
            normal:
            {
                opacity: 0.8,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
            }
        };

        // Create scatter plots
        let series: any[] = this.course.assignmentTypes.map(type =>
        {
            return {
                type: 'scatter',
                name: type.name,
                data: CourseScatter.assignmentsData(this.course.assignments.filter(a => a.typeId == type.id)),
                symbolSize: (data: any) => Math.max(Math.sqrt(type.weight * data[2].scoreMax / type.scoreMax) * 12, 12),

                label:
                {
                    emphasis:
                    {
                        show: true,
                        formatter: (p: any) => p.data[2].description,
                        position: 'top'
                    }
                },
            }
        });

        // Push other stuff
        series.push(
        {
            type: 'line',
            markLine: GraphUtils.getTermLines(),
            markArea: GraphUtils.getGradeMarkAreas(0.4)
        });

        return series;
    }

    /**
     * Convert assignments to series data
     *
     * @param assignments Assignments
     */
    private static assignmentsData(assignments: Assignment[])
    {
        return assignments.filter(a => a.complete == 'Complete')
            .map(a => [a.time, (a.score / a.scoreMax * 100).toFixed(2), a]);
    }
}
