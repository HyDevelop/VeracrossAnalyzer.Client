import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';
import Course from '@/logic/course';
import Constants from '@/constants';
import Navigation from '@/components/navigation/navigation';
import {CourseUtils} from '@/logic/utils/course-utils';
import GraphUtils from '@/logic/utils/graph-utils';

@Component({
})
export default class OverallLine extends Vue
{
    @Prop({required: true}) courses: Course[];

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
     * Convert assignments list to a graph dataset.
     */
    get convertChart()
    {
        let courses = this.courses.filter(c => c.assignments.length > 0);

        // Compute the column names
        let columns = courses.map(course => course.name);
        columns.unshift('date');

        // Find the min date
        let minDates = courses.map(course => course.assignments[course.assignments.length - 1].date.getTime());
        let minDate: Date = new Date(Math.min.apply(null, minDates));

        // Find the dates in between
        let now = new Date(Math.min(new Date().getTime(), CourseUtils.getTermEndDate().getTime()));
        let dates = [];
        for (let date = minDate; date <= now; date.setDate(date.getDate() + 1))
        {
            dates.push(new Date(date));
        }

        // Compute the rows data
        let rows: {[index: string]: any}[] = [];
        dates.forEach(date =>
        {
            // Define row object
            let row: {[index: string]:any} = {'date': date.getTime()};

            // Loop through courses
            courses.forEach(course =>
            {
                // Total Mean
                if (course.grading.method == 'TOTAL_MEAN')
                {
                    let score = 0;
                    let max = 0;

                    // Loop through assignments
                    course.assignments.forEach(assignment =>
                    {
                        // If assignment should be displayed
                        if (assignment.complete != 'Complete') return;

                        // Date is being looked at
                        if (assignment.date.getTime() < date.getTime())
                        {
                            // Record scores
                            score += assignment.score;
                            max += assignment.scoreMax;
                        }
                    });

                    // Add average to the row
                    row[course.name] = score / max * 100;
                }
                else if (course.grading.method == 'PERCENT_TYPE')
                {
                    let typeScores: {[index: string]: any} = {};
                    let typeCounts: {[index: string]: any} = {};

                    // Loop through assignments
                    course.assignments.forEach(assignment =>
                    {
                        // If assignment should be displayed
                        if (assignment.complete != 'Complete') return;

                        // Date is being looked at
                        if (assignment.date.getTime() < date.getTime())
                        {
                            // Record scores
                            if (typeScores[assignment.type] == undefined) typeScores[assignment.type] = 0;
                            typeScores[assignment.type] += assignment.score / assignment.scoreMax;

                            if (typeCounts[assignment.type] == undefined) typeCounts[assignment.type] = 0;
                            typeCounts[assignment.type] ++;
                        }
                    });

                    // Count total percentage (This is to avoid less than expected cases)
                    // Eg. If HW = 25% and Quiz = 75%, I have 1 hw and 0 quiz
                    // Without total percentage, the avg grade I get is 25%.
                    let totalPercentage = 0;
                    for (let type in course.grading.weightingMap)
                    {
                        if (typeScores[type] != undefined)
                        {
                            totalPercentage += course.grading.weightingMap[type];
                        }
                    }

                    // Count
                    let score = 0;
                    for (let type in typeScores)
                    {
                        let typeFactor = course.grading.weightingMap[type] / totalPercentage;
                        score += typeScores[type] * typeFactor / typeCounts[type];
                    }

                    // Add average to the row
                    if (score != 0) row[course.name] = score * 100;
                }
            });

            // Add it to the array
            rows.push(row);
        });

        return {
            columns: columns,
            rows: rows
        }
    }
}
