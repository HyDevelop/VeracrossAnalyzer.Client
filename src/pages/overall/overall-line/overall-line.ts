import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';
import Course from '@/logic/course';
import {CourseUtils} from '@/logic/utils/course-utils';
import GraphUtils from '@/logic/utils/graph-utils';
import {GPAUtils} from '@/logic/utils/gpa-utils';
import Constants from '@/constants';
import Navigation from '@/components/navigation/navigation';

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
                    type: 'slider',
                    startValue: this.getStartDate(),

                    // Minimum zoom: 1 week
                    minValueSpan: 7 * 24 * 60 * 60 * 1000
                }
            ],

            // Tooltip
            tooltip:
            {
                ... GraphUtils.tooltipCssShadow(),

                trigger: 'axis'
            },

            // Axis
            xAxis:
            {
                type: 'time',
                axisLabel:
                {
                    formatter: (name: any) => moment(name).format('MMM DD')
                },
            },
            yAxis:
            {
                axisLabel:
                {
                    formatter: (name: any) => name + '%'
                },
                min: (value: any) => Math.floor(value.min),
                max: (value: any) => Math.min(Math.ceil(value.max), 110)
            },

            // Series data
            series: this.series()
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
     * Get starting date
     */
    private getStartDate()
    {
        // If it's a past term, use the term's end date, else use today.
        let selected = Navigation.instance.getSelectedTerm();
        let end = selected == Constants.CURRENT_TERM || selected == -1
            ? moment() : moment(CourseUtils.getTermEndDate());

        return Math.max(end.subtract(30, 'days').toDate().getTime(),
                CourseUtils.getTermBeginDate().getTime())
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
        let assignments = course.assignments.slice().reverse();

        // Create series
        return {
            name: course.name,
            type: 'line',
            smooth: true,
            symbol: 'circle', // circle, diamond, emptyCircle, none
            data: this.toDateRange([...new Set(assignments.map(a => a.time))].map(time =>
            {
                // Find subset before this assignment
                let subset = course.getAssignmentsBefore(time);

                // Find grade
                if (course.termGrading[subset.term].method == 'PERCENT_TYPE')
                    return [time, GPAUtils.getPercentTypeAverage(course.termGrading[subset.term], subset.assignments)];
                else return [time, GPAUtils.getTotalMeanAverage(subset.assignments)];
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
        // Find the min date
        let minDate: Date = new Date(data[0][0]);

        // Find the dates in between
        let now = new Date(Math.min(new Date().getTime(), CourseUtils.getTermEndDate().getTime()));
        let times: number[] = [];
        for (let date = minDate; date <= now; date.setDate(date.getDate() + 1)) times.push(date.getTime());

        // Map the points
        let lastValue: any = null;
        return times.map(time =>
        {
            // Data point on this specific date
            let thisValue = data.find(a => a[0] == time);

            // Switching terms
            if (Constants.TERMS.find(t => t.getTime() == time))
                lastValue = null;

            // Find value
            return thisValue == null
                ? lastValue == null ? null : [time, lastValue[1]]
                : [time, (lastValue = thisValue)[1]];
        });
    }
}
