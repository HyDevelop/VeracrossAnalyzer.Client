import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';
import Navigation from '@/components/navigation/navigation';
import Overall from '@/pages/overall/overall';
import Constants from '@/constants';
import JsonUtils from '@/utils/json-utils';

/**
 * Objects of this interface represent assignment grades.
 */
export interface Grade
{
    type: string,
    description: string,
    date: string,
    complete: string,
    include: boolean,
    display: boolean,

    scoreMax: number,
    score: number
}

/**
 * A course
 */
export interface Course
{
    assignmentsId: number,
    id: number,
    name: string,
    teacherName: string,

    assignments: Grade[]
}

@Component({
    components: {Login, Navigation, Overall},
})
export default class App extends Vue
{
    public showLogin: boolean = true;

    public courses: Course[] = [];

    public selectedTab: string = "overall";

    public assignmentsReady: boolean = false;

    /**
     * This is called when the user logs in.
     *
     * @param courses Courses Json
     */
    public onLogin(courses: Course[])
    {
        // Hide login bar
        this.showLogin = false;

        // Assign courses
        this.courses = courses;

        // Debug output TODO: Remove this
        console.log(courses);

        // Get assignments for all the courses
        this.courses.forEach(course =>
        {
            // Send request to get assignments
            fetch(`${Constants.API_URL}/veracross/assignments?id=${course.assignmentsId}`).then(res =>
            {
                // Get response body text
                res.text().then(text =>
                {
                    // Parse json and filter it
                    course.assignments = JsonUtils.filterAssignments(JSON.parse(text));
                })
            })
            .catch(err =>
            {
                alert(err);
            });
        });
    }

    /**
     * This is called when a navigation tab is clicked
     *
     * @param tab Tab name
     */
    public onNavigate(tab: string)
    {
        // Debug output TODO: Remove this
        console.log(tab);

        // Update selected tab
        this.selectedTab = tab;
    }
}
