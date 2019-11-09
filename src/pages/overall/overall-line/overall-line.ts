import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';
import Course from '@/logic/course';
import Constants from '@/constants';

@Component({
})
export default class OverallLine extends Vue
{
    @Prop({required: true}) courses: Course[];

    private settings =
    {
        // Title
        title:
        {
            show: true,
            textStyle:
            {
                fontSize: 12
            },
            text: 'Average Grade',
            subtext: 'Average score trend for every course',
            x: 'center'
        },
        legend: {show: false},

        // Zoom bar
        dataZoom:
        [
            {
                startValue: moment().subtract(30, 'days').toDate().getTime()
            },
            {
                type: 'inside'
            }
        ],
        series:
        {
            smooth: true,

            // Quarter lines
            markLine:
            {
                silent: true,
                data: Constants.TERMS.map(term => {return {xAxis: term.getTime()}})
            },

            // Mark area
            markArea:
            {
                silent: true,
                data:
                [
                    // Above 100
                    [
                        {
                            yAxis: 120,
                            itemStyle: {color: 'rgba(230,253,255,0.09)'}
                        }, {yAxis: 100}
                    ],
                    // 90 to 100
                    [
                        {
                            yAxis: 100,
                            itemStyle: {color: 'rgba(241,255,237,0.09)'}
                        }, {yAxis: 90}
                    ],
                    // 80 to 90
                    [
                        {
                            yAxis: 90,
                            itemStyle: {color: 'rgba(255,250,216,0.09)'}
                        }, {yAxis: 80}
                    ],
                    // 70 to 80
                    [
                        {
                            yAxis: 80,
                            itemStyle: {color: 'rgba(255,225,199,0.1)'}
                        }, {yAxis: 70}
                    ],
                    // Below 70 (Fail)
                    [
                        {
                            yAxis: 70,
                            itemStyle: {color: 'rgb(255,190,184, 0.09)'}
                        }, {yAxis: -100}
                    ]
                ]
            }
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

    chartCache: any;

    /**
     * Convert assignments list to a graph dataset.
     */
    get convertChart()
    {
        // Caching
        if (this.chartCache != undefined) return this.chartCache;

        let courses = this.courses.filter(c => c.assignments.length > 0);

        // Compute the column names
        let columns = courses.map(course => course.name);
        columns.unshift('date');

        // Find the min date
        let minDates = courses.map(course => course.assignments[course.assignments.length - 1].date.getTime());
        let minDate: Date = new Date(Math.min.apply(null, minDates));

        // Find the dates in between
        let now = new Date();
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

        return this.chartCache =
        {
            columns: columns,
            rows: rows
        }
    }
}
