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
import AppDemo from '@/components/app/app-demo';

@Component({
    components: {Login, Navigation, Overall, Loading, CoursePage, Info, CourseSelection},
})
export default class App extends Vue
{
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

    // Show rating
    showRating: boolean = this.$cookies.get('show-rating') == 'set=yes';

    // Demo mode
    demoMode: boolean = window.location.hostname == 'demo.vera.hydev.org' || this.$cookies.isKey('demo-mode')

    // Is the login panel shown
    showLogin: boolean = !this.demoMode

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

        // Default config
        if (!this.$cookies.isKey('show-rating'))
        {
            this.showRating = Constants.CURRENT_TERM == 3;
        }

        // Demo
        if (this.demoMode)
        {
            AppDemo.loadDemo(this);
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
        this.courses = user.courses

        // Assign user to http client
        App.http.user = user;

        // Load assignments
        this.loadAssignments();
    }

    /**
     * Load the assignments of the courses
     */
    loadAssignments()
    {
        // Show loading message
        this.logLoading('1. Loading assignments...');

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
        this.logLoading('2. Checking grading algorithms...');

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
                            this.$cookies.set(cookieIndex, 'TOTAL_MEAN', '3d');
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

            // Check if rating notification should be displayed
            if (this.courses.filter(c => c.rated).length == 0 && this.showRating &&
                !this.$cookies.isKey('rating-notified'))
            {
                // Show notification
                this.$cookies.set('rating-notified', true);
                this.showUpdates()
            }
        })
    }

    showUpdates()
    {
        this.$alert(
            '<b>TL;DR:</b><br/>' +
            '📅 Added a Course Selection tab to help you schedule for next year!<br/>' +
            '🤩 You can now give star ratings to your courses!<br/>' +
            '😮 You can also see others\' ratings in the course selection tab!<br/>' +
            '<br/>' +
            'That\'s it, try things out and have fun! 😇<br/>' +
            '<br/>' +
            '-- The Veracross Analyzer Team<br/>' +
            '-- Made with 🧡 in SJP',
            '🥳 Huge updates!',
            {dangerouslyUseHTMLString: true, confirmButtonText: 'OK', customClass: 'comic'});
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
