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
                type: 'time',
                name: 'Timeline'
            },

            // Y axis represents GPAs and MaxGPAs
            yAxis:
            {
                type: 'value',
                name: 'Percentage Score',
                max: 1,
                min: 0
            },

            // Data
            series: this.mapAssignments().forEach((assignments, type) =>
            {
                return {
                    type: 'scatter',
                    name: type,
                    data: CourseScatter.assignmentsData(assignments)
                }
            }),

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
        return assignments.map(a => [a.date, a.score / a.scoreMax]);
    }
}
