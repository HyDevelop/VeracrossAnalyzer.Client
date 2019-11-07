import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment} from '@/components/app/app';
import Constants from '@/constants';
import {FormatUtils} from '@/utils/format-utils';
import moment from 'moment';
import Course from '@/logic/course';

@Component({
})
export default class CourseScatter extends Vue
{
    private static DOT = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:{color}"></span>';

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
        // Map assignments
        let map = this.mapAssignments();

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

        // Create settings
        let settings =
        {
            // Color
            color: Constants.THEME.colors,

            // Title
            title:
            {
                show: true,
                textStyle:
                {
                    fontSize: 13
                },
                text: 'Assignments',
                subtext: 'Assignment scores for ' + this.course.name,
                x: 'center'
            },

            // X axis represents course names
            xAxis:
            {
                type: 'time',
                axisLabel:
                {
                    formatter: (name: any) => moment(name).format('MMM DD')
                },
                max: FormatUtils.toChartDate(new Date())
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
                max: 100,
                min: (value: any) => Math.floor(value.min) - 5
            },

            // Tooltip
            tooltip:
            {
                trigger: 'axis',
                axisPointer:
                {
                    type: 'cross'
                },
                formatter: (ps: any[]) => ps[0].data[0] + '<br>' + ps.map(p =>
                    `${CourseScatter.DOT.replace('{color}', p.color)}
                    ${FormatUtils.limit(p.data[2], 22)}: ${p.data[1]}%<br>`).join('')
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
            series: Array.from(map, ([type, assignments]) =>
            {
                return {
                    type: 'scatter',
                    name: type,
                    data: CourseScatter.assignmentsData(assignments),
                    itemStyle: itemStyle
                }
            })
        };

        return settings;
    }

    /**
     * Map assignments to {assignmentType, [assignment]} format.
     */
    private mapAssignments(): Map<string, Assignment[]>
    {
        // Define map
        let map = new Map();

        // Move data to map
        this.course.assignments.forEach(a =>
        {
            // Null case, create empty array
            if (!map.has(a.type)) map.set(a.type, []);

            // Put data
            map.get(a.type).push(a);
        });

        return map;
    }

    /**
     * Convert assignments to series data
     *
     * @param assignments Assignments
     */
    private static assignmentsData(assignments: Assignment[])
    {
        return assignments.filter(a => a.complete == 'Complete')
            .map(a => [FormatUtils.toChartDate(a.date), (a.score / a.scoreMax * 100).toFixed(2), a.description]);
    }
}
