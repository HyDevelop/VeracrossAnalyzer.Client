import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';
import Course, {Assignment} from '@/logic/course';
import Constants from '@/constants';
import Navigation from '@/components/navigation/navigation';
import {CourseUtils} from '@/logic/utils/course-utils';
import GraphUtils from '@/logic/utils/graph-utils';
import {GPAUtils} from '@/logic/utils/gpa-utils';

@Component
export default class OverallLine extends Vue
{
    @Prop({required: true}) courses: Course[];

    filteredCourses: Course[];

    /**
     * When this component is created
     */
    created()
    {
        this.filteredCourses = this.courses.filter(c => c.isGraded && c.assignments.length > 0);
    }

    /**
     * Override options
     *
     * @param options Original options (Unused)
     */
    afterConfig(options: any)
    {
        console.log(options);
        return this.settings;
    }

    private settings =
    {
        ...GraphUtils.getBaseSettings('Average Grade', 'Average score trend for every course'),

        // Zoom bar
        dataZoom:
        [
            {
                startValue: Math.max(moment().subtract(30, 'days').toDate().getTime(),
                    CourseUtils.getTermBeginDate().getTime())
            },
            {
                type: 'inside'
            }
        ],
        series:
        {
            smooth: true,
            markLine: GraphUtils.getTermLines(),
            markArea: GraphUtils.getGradeMarkAreas(0.09)
        },
        xAxis:
        {
            type: 'time'
        },
        yAxis:
        {
            min: (value: any) => Math.floor(value.min),
            max: (value: any) => Math.min(value.max, 110)
        }
    };

    /**
     * Generate series data for a course
     *
     * @param course
     */
    private getCourseSeries(course: Course)
    {
        return {
            name: course.name,
            type: 'line',
            smooth: true,
            data: course.gradedAssignments.slice().reverse().map((assignment, i, array) =>
            {
                // Find subset before this assignment
                let subset = array.filter(a => a.time <= assignment.time);
                console.log(subset);

                // Find grade
                if (course.grading.method == 'PERCENT_TYPE')
                    return [assignment.time, GPAUtils.getPercentTypeAverage(course, subset)];
                if (course.grading.method == 'TOTAL_MEAN')
                    return [assignment.time, GPAUtils.getTotalMeanAverage(subset)];
            })
        }
    }
}
