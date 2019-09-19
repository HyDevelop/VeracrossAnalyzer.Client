import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
    components: {GraphOverall}
})
export default class Overall extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    get convertCharts()
    {
        // Null case
        if (this.courses == null) return [];

        // Filter it
        let courses: Course[] = this.filterCourses();

        // Compute the column names
        let columns = ['date'];
        courses.forEach(course =>
        {
            columns.push(course.name);
        });

        // Find the min date
        let minDate: Date = new Date();
        courses.forEach(course =>
        {
            if (course.assignments.length == 0) return;
            let date = new Date(course.assignments[course.assignments.length - 1].date);
            if (date < minDate) minDate = date;
        });

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
                    let assignmentDate = new Date(assignment.date);

                    // Date is being looked at
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

    /**
     * Return a list of courses that are graphed
     */
    private filterCourses(): Course[]
    {
        // Define result
        let result: Course[] = [];

        // Filter through courses
        this.courses.forEach(course =>
        {
            // Skip future or past courses
            if (course.status != 'active') return;

            // Skip courses without levels
            if (course.level == 'None') return;

            // Skip courses without assignments
            if (course.assignments.length == 0) return;

            // Add it to the list
            result.push(course);
        });

        return result;
    }

    /**
     * This function is called to get gpa as a string.
     */
    public getGPA()
    {
        let gpa = GPAUtils.getGPA(this.courses);
        let result = '' + gpa.gpa;

        /* Not accurate
        if (!gpa.accurate)
        {
            result = `(${result})`;
        }*/

        return result;
    }

    /**
     * This function is called when the sign out button is clicked.
     */
    public signOut()
    {
        // Call custom event
        this.$emit('sign-out');
    }
}
