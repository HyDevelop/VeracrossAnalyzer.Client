import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';
import Navigation from '@/components/navigation/navigation';
import Overall from '@/pages/overall/overall.vue';
import Constants from '@/constants';
import pWaitFor from 'p-wait-for';
import {HttpUtils} from '@/logic/utils/http-utils';
import Loading from '@/components/overlays/loading.vue';
import CoursePage from '@/pages/course/course-page.vue';
import Course from '@/logic/course';
import LoginUser from '@/logic/login-user';


@Component({
    components: {Login, Navigation, Overall, Loading, CoursePage},
})
export default class App extends Vue
{
    // Is the login panel shown
    public showLogin: boolean = true;

    // List of course that the student takes
    public courses: Course[] = [];

    // List of course that should be displayed
    public filteredCourses: Course[] = [];

    // The currently selected tab
    public selectedTab: string = 'overall';

    // Are the course assignments loaded from the server.
    public assignmentsReady: boolean = false;

    // Token
    public user: LoginUser = null as any;

    // Loading text
    public loading: string = '';

    // Loading error
    public loadingError: boolean = false;

    // Http Client
    public static http: HttpUtils = new HttpUtils();

    // Instance
    public static instance: App;

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Show splash
        console.log(Constants.SPLASH);

        // Update instance
        App.instance = this;
    }

    /**
     * This is called when the user logs in.
     *
     * @param user Authorization user
     */
    public onLogin(user: LoginUser)
    {
        // Hide login bar
        this.showLogin = false;

        // Show loading message
        this.logLoading('1. Logging in...');

        // Store user
        this.user = user;

        // Assign user to http client
        App.http.user = user;

        // Load data
        this.loadCoursesAfterLogin();
    }

    /**
     * Load courses data after logging in.
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
                this.courses = response.data.map((courseJson: any) => new Course(courseJson));

                // Load assignments
                this.loadAssignments();
            }
            else throw new Error(response.data);
        })
        .catch(e => this.showError(`Error: Course data failed to load.\n(${e})`));
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
                    course.loadAssignments(response.data);
                }
                else throw new Error(response.data);
            })
            .catch(e => this.showError(`Error: Assignments data failed to load.\n(${e})`));
        });

        // Wait for assignments to be ready.
        pWaitFor(() => this.courses.every(c => c.rawAssignments != null)).then(() =>
        {
            // Filter courses
            this.filteredCourses = this.courses.filter(c => c.isGraded);

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
            // Check if already exist in cookies
            if (this.$cookies.isKey('va.grading.' + course.assignmentsId))
            {
                course.grading = {method: 'TOTAL_MEAN', weightingMap: {}};
                continue;
            }

            // Request grading scheme for this course
            App.http.post('/grading', {'assignmentsId': course.assignmentsId}).then(response =>
            {
                // Check success
                if (response.success)
                {
                    // Add it to course
                    course.grading = response.data;

                    // If it's total_mean, cache it to cookies
                    // This is because only percent_type can update over time
                    if (course.grading.method == 'TOTAL_MEAN')
                    {
                        this.$cookies.set('va.grading.' + course.assignmentsId, 'TOTAL_MEAN', '3d');
                    }
                }
                else throw new Error(response.data);
            })
            .catch(e => this.showError(`Error: Grading data failed to load.\n(${e})`))
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
     * Show error message on loading screen
     *
     * @param message Error message
     */
    private showError(message: string)
    {
        this.loadingError = true;
        this.loading = message;
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

    /**
     * Select time (Eg. Term 1, Term 2, All Year, etc.)
     *
     * @param code
     */
    public selectTime(code: number)
    {
        // TODO: Optimize
        window.location.reload();
    }
}
