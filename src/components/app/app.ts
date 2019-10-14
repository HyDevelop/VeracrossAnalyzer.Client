import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';
import Navigation from '@/components/navigation/navigation';
import Overall from '@/pages/overall/overall';
import Constants from '@/constants';
import JsonUtils from '@/utils/json-utils';
import pWaitFor from 'p-wait-for';
import {HttpUtils} from '@/utils/http-utils';
import {CourseUtils} from '@/utils/course-utils';
import {GPAUtils} from '@/utils/gpa-utils';
import Loading from '@/components/loading/loading.vue';

/**
 * Objects of this interface represent assignment grades.
 */
export interface Assignment
{
    id: number,
    scoreId: number,
    type: string,
    typeId: number,
    description: string,
    date: string,
    complete: string,
    include: boolean,
    display: boolean,

    unread: boolean,

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
    status: string,

    letterGrade?: string,
    numericGrade?: number,

    level: string,
    scaleUp: number,

    grading:
    {
        method: string,
        weightingMap: {[index: string]: number}
    }

    assignments: Assignment[]
}

@Component({
    components: {Login, Navigation, Overall, Loading},
})
export default class App extends Vue
{
    // Is the login panel shown
    public showLogin: boolean = true;

    // List of course that the student takes
    public courses: Course[] = [];

    // List of course that should be displayed
    public filteredCourses: Course[] = [];

    // Currently selected tab
    public selectedTab: string = 'overall';

    // Are the course assignments loaded from the server.
    public assignmentsReady: boolean = false;

    // Token
    public token: string = '';

    // Loading text
    public loading: string = '';

    // Loading error
    public loadingError: boolean = false;

    // Http Client
    public static http: HttpUtils = new HttpUtils();

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

        // Show loading message
        this.logLoading('1. Logging in...');

        // Store token
        this.token = token;

        // Assign token to http client
        App.http.token = token;

        // Load data
        this.loadCoursesAfterLogin();
    }

    /**
     * Load courses data after login.
     */
    public loadCoursesAfterLogin()
    {
        // Show loading message
        this.logLoading('2. Loading courses...');

        // Post request
        App.http.post('/courses', {}).then(response =>
        {
            // Check success
            if (response.success)
            {
                // Save courses
                this.courses = response.data;

                // Load assignments
                this.loadAssignments();
            }
            else
            {
                // Show error message TODO: Show it properly
                alert(response.data);
            }
        })
        .catch(alert);
    }

    /**
     * Load the assignments of the courses
     */
    public loadAssignments()
    {
        // Show loading message
        this.logLoading('3. Loading assignments...');

        // Get assignments for all the courses
        this.courses.forEach(course =>
        {
            // Send request to get assignments
            App.http.post('/assignments', {'assignmentsId': course.assignmentsId}).then(response =>
            {
                // Check success
                if (response.success)
                {
                    // Load assignments
                    // Parse json and filter it
                    course.assignments = JsonUtils.filterAssignments(response.data);
                }
                else
                {
                    // Show error message TODO: Show it properly
                    alert(response.data);
                }
            })
            .catch(alert);
        });

        // Wait for assignments to be ready.
        pWaitFor(() => this.courses.every(c => c.assignments != null)).then(() =>
        {
            // Filter courses
            this.filteredCourses = CourseUtils.getGradedCourses(this.courses);

            // Check grading algorithms
            this.checkGradingAlgorithms();
        });
    }

    /**
     * Check the courses' grading algorithms. (Total-mean or percent-type)
     */
    private checkGradingAlgorithms()
    {
        // Show loading message
        this.logLoading('4. Checking grading algorithms...');

        // Loop through all the courses
        for (const course of this.filteredCourses)
        {
            // Check if total-average grade is the same with percent-type grade
            if (course.numericGrade == +GPAUtils.getTotalMeanAverage(course).toFixed(2))
            {
                course.grading = {method: 'TOTAL_MEAN', weightingMap: {}};
            }
            else
            {
                // Request grading scheme for this course
                App.http.post('/grading', {'assignmentsId': course.assignmentsId}).then(response =>
                {
                    // Check success
                    if (response.success)
                    {
                        // Add it to course
                        course.grading = response.data;
                    }
                    else
                    {
                        // Show error message TODO: Show it properly
                        alert(response.data)
                    }
                })
                .catch(alert)
            }
        }

        // Wait for done
        pWaitFor(() => this.filteredCourses.every(c => c.grading != undefined)).then(() =>
        {
            // When the assignments are ready
            this.assignmentsReady = true;

            // Remove loading
            this.logLoading('');
        })
    }

    /**
     * Log a message to loading screen
     *
     * @param message Message
     */
    private logLoading(message: string)
    {
        if (message == '') this.loading = '';
        else this.loading += '\n' + message;
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

    /**
     * Sign out
     */
    public signOut()
    {
        // Clear all cookies
        this.$cookies.keys().forEach(key => this.$cookies.remove(key));

        // Refresh
        window.location.reload();
    }
}
