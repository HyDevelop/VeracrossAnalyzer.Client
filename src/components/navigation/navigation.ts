import {Component, Prop, Vue} from 'vue-property-decorator';
import App from '@/components/app/app';
import {CourseUtils} from '@/logic/utils/course-utils';
import {FormatUtils} from '@/logic/utils/format-utils';
import pWaitFor from 'p-wait-for';
import Course from '@/logic/course';
import Constants from '@/constants';
import LoginUser from '@/logic/login-user';

/**
 * This component is the top navigation bar
 */
@Component
export default class Navigation extends Vue
{
    @Prop({required: true}) activeIndex: string;
    @Prop({required: true}) courses: Course[];
    @Prop({required: true}) user: LoginUser;

    private gradingPeriod: string = 'All Year';

    // Instance
    static instance: Navigation;

    /**
     * This is called when the instance is created.
     */
    created()
    {
        // Check selected time
        if (!this.$cookies.isKey('va.grading-period'))
        {
            this.$cookies.set('va.grading-period', this.gradingPeriod, '10y');
        }
        this.gradingPeriod = this.$cookies.get('va.grading-period');
    }

    /**
     * This is called when the instance is loaded.
     */
    mounted()
    {
        // Set instance
        Navigation.instance = this;

        // Set history state
        let url = '/' + window.location.hash;
        if (url == '/' || url == '') url = '/#overall';
        window.history.replaceState({lastTab: url.substring(1)}, '', url);

        // Update initial index after loading is done
        pWaitFor(() => this.courses.length > 1 && App.instance.loading != '').then(() =>
        {
            this.updateIndex(url.substring(2), false);
        });

        // Create history state listener
        window.onpopstate = e =>
        {
            if (e.state)
            {
                // Restore previous tab
                console.log(`onPopState: Current: ${this.activeIndex}, Previous: ${e.state.lastTab}`);
                this.updateIndex(e.state.lastTab, false);
            }
        };
    }

    formatCourseIndex(course: Course)
    {
        return CourseUtils.formatTabIndex(course);
    }

    /**
     * This function is called when the selection changes.
     *
     * @param index The index selected
     * @param indexPath The path of the index
     */
    onSelect(index: string, indexPath: string)
    {
        // Update active index
        this.updateIndex(index);
    }

    /**
     * Update index
     *
     * @param newIndex New index
     * @param history Record in history or not (Default true)
     */
    updateIndex(newIndex: string, history?: boolean)
    {
        // Call custom event
        this.$emit('update:activeIndex', newIndex);

        // Record or not
        if (history == null || history)
        {
            // Check url
            let url = `/#${newIndex}`;

            // Push history state
            window.history.pushState({lastTab: newIndex}, '', url);
        }

        // Update title
        document.title = 'Veracross Analyzer - ' + this.getTitle(newIndex);

        // Scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * Move to the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    nextCourse(indexOffset: number)
    {
        // Set tab to the next index
        this.updateIndex(CourseUtils.formatTabIndex(this.findNextCourse(indexOffset)))
    }

    /**
     * Find the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    findNextCourse(indexOffset: number)
    {
        return this.findCourse(this.activeIndex.split('/')[1], indexOffset);
    }

    /**
     * Find course
     *
     * @param courseId Course ID
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    findCourse(courseId: string, indexOffset: number)
    {
        // Find current course index
        let courseIndex = this.courses.findIndex(c => c.id == +courseId);

        // Find next course
        return this.courses[courseIndex + indexOffset];
    }

    /**
     * Select grading period
     *
     * @param command Term 1, Term 2, All Year, etc.
     */
    selectGradingPeriod(command: string)
    {
        this.gradingPeriod = command;
        this.$cookies.set('va.grading-period', command, '10y');

        // Call event
        this.$emit('select-time', this.getSelectedTerm());
    }

    /**
     * Get code for selected time
     */
    getSelectedTerm(): number
    {
        if (this.gradingPeriod == 'All Year') return -1;
        else return +this.gradingPeriod.replace('Term ', '') - 1;
    }

    /**
     * Avatar dropdown menu event
     *
     * @param cmd Command: sign-out
     */
    onAvatarMenu(cmd: string)
    {
        switch (cmd)
        {
            case 'sign-out':
            {
                this.$emit('sign-out');
                break
            }
        }
    }

    get version() {return Constants.VERSION}
}
