import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import Constants from '@/constants';
import {FormatUtils} from '@/utils/format-utils';

@Component({
})
export default class CourseScatter extends Vue
{
    // @ts-ignore
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
                max: FormatUtils.toChartDate(new Date())
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value',
                name: 'Percentage Score',
                nameLocation: 'center',
                nameGap: 28,
                max: 100,
                min: (value: any) => Math.floor(value.min) - 5
            },

            // Tooltip
            tooltip:
            {
                trigger: 'axis'
            },

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
                    data: CourseScatter.assignmentsData(assignments)
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
            .map(a => [FormatUtils.toChartDate(a.date), (a.score / a.scoreMax * 100).toFixed(2)]);
    }
}
