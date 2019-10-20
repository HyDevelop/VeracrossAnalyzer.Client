import {Component, Prop, Vue} from 'vue-property-decorator';
import {Assignment, Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import Constants from '@/constants';

@Component({
})
export default class CourseScatter extends Vue
{
    // @ts-ignore
    @Prop({required: true}) course: Course;

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
                    formatter: (value: string) => value.length <= 16 ? value : value.substr(0, 14) + '...'
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
            if (map.has(a.type)) map.set(a.type, []);

            // Put data
            map.get(a.type).push(a);
        });

        return map;
    }
}
