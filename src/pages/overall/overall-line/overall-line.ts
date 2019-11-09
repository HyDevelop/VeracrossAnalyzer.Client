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
    settings: any;

    /**
     * When this component is created
     */
    created()
    {
        // Filter courses
        this.filteredCourses = this.courses.filter(c => c.isGraded && c.assignments.length > 0);

        // Generate settings
        this.settings =
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
                max: (value: any) => Math.min(Math.ceil(value.max), 110)
            }
        }
    }

    /**
     * Override options
     *
     * @param options Original options (Unused)
     */
    afterConfig(options: any)
    {
        return this.settings;
    }

    /**
     * Generate series data
     */
    private series()
    {
        // Each course
        let series: any[] = this.filteredCourses.map(course => this.getCourseSeries(course));

        // Push other stuff
        series.push(
        {
            type: 'line',
            markLine: GraphUtils.getTermLines(),
            markArea: GraphUtils.getGradeMarkAreas(0.4)
        });

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
        let dates: number[] = [];
        for (let date = minDate; date <= now; date.setDate(date.getDate() + 1))
        {
            dates.push(new Date(date).getTime());
        }

        console.log(dates);

        let lastValue: any = null;
        return dates.map(date =>
        {
            // Data point on this specific date
            let thisValue = data.find(a => a[0] == date);

            // None
            if (thisValue == null) return [date, lastValue == null ? null : lastValue[1]];
            else return [date, (lastValue = thisValue)[1]];
        });
    }
}
