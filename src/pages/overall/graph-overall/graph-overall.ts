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
            min: 70
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

        // Initialize course specific variables
        let courseScores: {[index: string]: any} = {};
        let courseMaxScores: {[index: string]: any} = {};
        let courseIndexes: {[index: string]: any} = {};
        courses.forEach(course =>
        {
            courseScores[course.name] = 0;
            courseMaxScores[course.name] = 0;
            courseIndexes[course.name] = course.assignments.length - 1;
        });

        // Compute the rows data
        let rows: {[index: string]: any}[] = [];
        dates.forEach(date =>
        {
            // Define row object
            let row: {[index: string]:any} = {'date': date.toLocaleDateString('en-US')};

            // Loop through courses
            courses.forEach(course =>
            {
                // Reversed loop through the assignments
                for (let r = courseIndexes[course.name]; r >= 0; r--)
                {
                    let assignment = course.assignments[r];

                    // If assignment should be displayed
                    if (assignment.complete != 'Complete') continue;

                    // Date is being looked at
                    let assignmentDate = new Date(assignment.date);
                    if (assignmentDate.getTime() == date.getTime())
                    {
                        // Record scores
                        courseScores[course.name] += assignment.score;
                        courseMaxScores[course.name] += assignment.scoreMax;
                    }

                    // Not now
                    else if (assignmentDate > date)
                    {
                        courseIndexes[course.name] = r;
                        break;
                    }
                }

                // Add average to the row
                row[course.name] = courseScores[course.name] / courseMaxScores[course.name] * 100;
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
