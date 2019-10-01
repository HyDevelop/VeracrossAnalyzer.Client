import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';

@Component({
})
export default class GraphOverall extends Vue
{
    // @ts-ignore
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
        // Legend
        legend:
        {
            show: false,
            //left: 'auto',
            //align: 'left',
            //orient: 'vertical'
            textStyle:
            {
                fontSize: 11
            },
            icon: 'circle'
        },
        // Zoom bar
        dataZoom:
        [
            // TODO: Calculate real value for startValue
            {
                startValue: '9/13/2019'
            },
            {
                type: 'inside'
            }
        ],
        series:
        {
            smooth: true
        },
        xAxis:
        {
            //type: 'time'
        },
        yAxis:
        {
            min: (value: any) => value.min - 10
        }
    };

    /**
     * Convert assignments list to a graph dataset.
     */
    get convertChart()
    {
        let courses = this.courses;

        // Compute the column names
        let columns = courses.map(course => course.name);
        columns.unshift('date');

        // Find the min date
        let minDates = courses.map(course => new Date(course.assignments[course.assignments.length - 1].date).getTime());
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
            let row: {[index: string]:any} = {'date': date.toLocaleDateString('en-US')};

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
                        let assignmentDate = new Date(assignment.date);
                        if (assignmentDate.getTime() < date.getTime())
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
                        let assignmentDate = new Date(assignment.date);
                        if (assignmentDate.getTime() < date.getTime())
                        {
                            // Record scores
                            if (typeScores[assignment.type] == undefined) typeScores[assignment.type] = 0;
                            typeScores[assignment.type] += assignment.score / assignment.scoreMax;

                            if (typeCounts[assignment.type] == undefined) typeCounts[assignment.type] = 0;
                            typeCounts[assignment.type] ++;
                        }
                    });

                    let score = 0;

                    // Count
                    for (let type in typeScores)
                    {
                        score += typeScores[type] * course.grading.weightingMap[type] / typeCounts[type];
                    }

                    // Add average to the row
                    row[course.name] = score * 100;
                }
            });

            // Add it to the array
            rows.push(row);
        });

        console.log(rows);

        return {
            columns: columns,
            rows: rows
        }
    }
}
