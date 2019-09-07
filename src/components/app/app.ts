import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';
import Navigation from '@/components/navigation/navigation';
import Overall from '@/pages/overall/overall';
import Constants from '@/constants';
import JsonUtils from '@/utils/json-utils';
import pWaitFor from 'p-wait-for';

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
    // Is the login panel shown
    public showLogin: boolean = true;

    // List of course that the student takes
    public courses: Course[] = [];

    // Currently selected tab
    public selectedTab: string = "overall";

    // Are the course assignments loaded from the server.
    public assignmentsReady: boolean = false;

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Show splash
        console.log(Constants.SPLASH);
    }

    /**
     * This is called when the user logs in.
     *
     * @param token Authorization token
     */
    public onLogin(token: string)
    {
        // Hide login bar
        this.showLogin = false;

        // Save token to cookies
        this.$cookies.set('va.token', token, '7d');
    }

    /**
     * This is called when the user logs in.
     *
     * @param courses Courses Json
     */
    public saveCourses(courses: Course[])
    {
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

        // Wait for assignments to be ready.
        pWaitFor(() => this.isAssignmentsReady()).then(() =>
        {
            // When the assignments are ready
            this.assignmentsReady = true;
        });
    }

    /**
     * Are assignments ready or not
     *
     * @returns boolean Ready or not
     */
    private isAssignmentsReady(): boolean
    {
        for (const course of this.courses)
        {
            if (course.assignments == null) return false;
        }

        return true;
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
