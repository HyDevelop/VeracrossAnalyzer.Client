import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';

@Component({
    components: {GraphOverall}
})
export default class Overall extends Vue
{
    @Prop({required: true}) courses: any;

    get convertCharts()
    {
        // Null case
        if (this.courses == null) return [];

        // Compute the column names
        let columns = ['date'];
        this.courses.forEach((course: Course) =>
        {
            columns.push(course.name);
        });

        // Find the min date
        let minDate: Date = new Date();
        this.courses.forEach((course: Course) =>
        {
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

        // Compute the rows data
        let rows: {[index: string]: any}[] = [];
        let courseAverages = {};
        dates.forEach(date =>
        {
            // Define row object
            let row: {[index: string]:any} = {'date': date};

            // Loop through courses
            this.courses.forEach((course: Course) =>
            {
                course.assignments.forEach(assignment =>
                {
                    // Date is being looked at
                    if (new Date(assignment.date) == date)
                    {
                        row[course.name] = assignment.score;
                    }

                    // Not now!
                    if (new Date(assignment.date) > date)
                    {
                        // Exit the course loop.
                        return;
                    }
                });
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
