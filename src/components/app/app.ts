import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login.vue';
import Navigation from '@/components/navigation/navigation.vue';
import Overall from '@/pages/overall/overall.vue';
import Constants from '@/constants';
import pWaitFor from 'p-wait-for';
import {HttpUtils} from '@/logic/utils/http-utils';
import Loading from '@/components/overlays/loading.vue';
import CoursePage from '@/pages/course/course-page.vue';
import Course from '@/logic/course';
import LoginUser from '@/logic/login-user';
import NavController from '@/logic/nav-controller';
import Info from '@/statics/Info.vue';
import CourseSelection from '@/pages/course-selection/course-selection.vue';

@Component({
    components: {Login, Navigation, Overall, Loading, CoursePage, Info, CourseSelection},
})
export default class App extends Vue
{
    // Is the login panel shown
    showLogin: boolean = true;

    // List of course that the student takes
    courses: Course[] = [];
    gradedCourses: Course[] = [];

    // Are the course assignments loaded from the server.
    assignmentsReady: boolean = false;

    // Token
    user: LoginUser = null as any;

    // Loading text
    loading: string = '';

    // Loading error
    loadingError: boolean = false;

    // Navigation controller
    nav: NavController = new NavController();

    // Http Client
    static http: HttpUtils = new HttpUtils();

    // Instance
    static instance: App;

    // Static page
    staticPage: string = '';

    // Dark mode
    darkMode: boolean = this.$cookies.isKey('dark');

    /**
     * This is called when the instance is created.
     */
    created()
    {
        // Show splash
        console.log(Constants.SPLASH);

        // Update instance
        App.instance = this;

        // Check location
        if (window.location.hash == '#info')
        {
            this.staticPage = 'info';
        }

    }

    /**
     * This is called when the user logs in.
     *
     * @param user Authorization user
     */
    onLogin(user: LoginUser)
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
    loadCoursesAfterLogin()
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
    loadAssignments()
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
            this.gradedCourses = this.courses.filter(c => c.isGraded);

            // Check grading algorithms
            this.checkGradingAlgorithms();
        });
    }

    /**
     * Check the courses' grading algorithms. (Total-mean or percent-type)
     */
    checkGradingAlgorithms()
    {
        // Show loading message
        this.logLoading('4. Checking grading algorithms...');

        // Loop through all the courses
        for (const course of this.gradedCourses)
        {
            for (const i of [0, 1, 2, 3])
            {
                const cookieIndex = `va.grading.${i}.${course.assignmentsId}`;

                // Check if already exist in cookies
                if (this.$cookies.isKey(cookieIndex))
                {
                    course.termGrading[i] = {method: 'TOTAL_MEAN', weightingMap: {}};
                    continue;
                }

                // Request grading scheme for this course at this grading period
                App.http.post('/grading/term', {assignmentsId: course.assignmentsId, term: i}).then(resp =>
                {
                    // Check success
                    if (resp.success)
                    {
                        // Add it to course
                        course.termGrading[i] = resp.data;

                        // If it's total_mean, cache it to cookies
                        // This is because only percent_type can update over time
                        if (course.termGrading[i].method == 'TOTAL_MEAN')
                        {
                            this.$cookies.set(cookieIndex, 'TOTAL_MEAN', 'd');
                        }
                    }
                    else throw new Error(resp.data);
                })
                .catch(e => this.showError(`Error: Grading data failed to load.\n(${e})`))
            }
        }

        // Wait for done
        pWaitFor(() => this.gradedCourses.every(c => c.termGrading.every(g => g != null))).then(() =>
        {
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
    logLoading(message: string)
    {
        if (message == '') this.loading = '';
        else this.loading += '\n' + message;
    }

    /**
     * Show error message on loading screen
     *
     * @param message Error message
     */
    showError(message: string)
    {
        this.loadingError = true;
        this.loading = message;
    }

    /**
     * Sign out
     */
    signOut()
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
    selectTime(code: number)
    {
        // TODO: Optimize
        window.location.reload();
    }
}
