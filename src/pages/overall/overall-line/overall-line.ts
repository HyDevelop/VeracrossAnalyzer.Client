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
        series: this.series(),
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
     * Generate series data
     */
    private series()
    {
        // Each course
        // todo: filter graded
        let series: any[] = this.courses.map(course => this.getCourseSeries(course));

        return series
    }

    /**
     * Generate series data for a course
     *
     * @param course
     */
    private getCourseSeries(course: Course)
    {
        // Graded assignments
        let assignments = course.gradedAssignments.slice().reverse();

        // Create series
        return {
            name: course.name,
            type: 'line',
            smooth: true,
            data: this.toDateRange([...assignments.map(a => a.time)].map((time, i) =>
            {
                // Find subset before this assignment
                let subset = assignments.filter(a => a.time <= time);
                console.log(subset);

                // Find grade
                if (course.grading.method == 'PERCENT_TYPE')
                    return [time, GPAUtils.getPercentTypeAverage(course, subset)];
                if (course.grading.method == 'TOTAL_MEAN')
                    return [time, GPAUtils.getTotalMeanAverage(subset)];
            }))
        }
    }

    /**
     * Convert point data to date range data.
     * Eg. [[Mon, 10], [Wed, 5]] to [[Mon, 10], [Tue, 10], [Wed, 5]]
     *
     * @param data
     */
    private toDateRange(data: any[])
    {
        // Construct date range

        // Find the min date
        let minDates = this.courses.map(course => course.assignments[course.assignments.length - 1].time);
        let minDate: Date = new Date(Math.min.apply(null, minDates));

        // Find the dates in between
        let now = new Date(Math.min(new Date().getTime(), CourseUtils.getTermEndDate().getTime()));
        let dates = [];
        for (let date = minDate; date <= now; date.setDate(date.getDate() + 1))
        {
            dates.push(new Date(date).getTime());
        }

        console.log(dates);

        return dates.map(date => data.filter(d => d[0] <= date));
    }
}
