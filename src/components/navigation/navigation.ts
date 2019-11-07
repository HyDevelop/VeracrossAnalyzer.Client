import {Component, Prop, Vue} from 'vue-property-decorator';
import App from '@/components/app/app';
import {CourseUtils} from '@/utils/course-utils';
import {FormatUtils} from '@/utils/format-utils';
import pWaitFor from 'p-wait-for';
import Course from '@/logic/course';

/**
 * This component is the top navigation bar
 */
@Component({
    components: {},
})
export default class Navigation extends Vue
{
    @Prop({required: true}) activeIndex: string;

    @Prop({required: true}) courses: Course[];

    private gradingPeriod: string = 'All Year';

    // Instance
    public static instance: Navigation;

    /**
     * This is called when the instance is created.
     */
    public created()
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
    public mounted()
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

    public formatCourseIndex(course: Course)
    {
        return CourseUtils.formatTabIndex(course);
    }

    /**
     * This function is called when the selection changes.
     *
     * @param index The index selected
     * @param indexPath The path of the index
     */
    public onSelect(index: string, indexPath: string)
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
    public updateIndex(newIndex: string, history?: boolean)
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
    }

    /**
     * Get title for index
     *
     * @param index Index
     */
    public getTitle(index: string)
    {
        // Course
        if (index.startsWith('course'))
        {
            return this.findCourse(index.split('/')[1], 0).name;
        }

        // Others
        return FormatUtils.toTitleCase(index);
    }

    /**
     * Move to the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    public nextCourse(indexOffset: number)
    {
        // Set tab to the next index
        this.updateIndex(CourseUtils.formatTabIndex(this.findNextCourse(indexOffset)))
    }

    /**
     * Find the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    public findNextCourse(indexOffset: number)
    {
        return this.findCourse(this.activeIndex.split('/')[1], indexOffset);
    }

    /**
     * Find course
     *
     * @param courseId Course ID
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    public findCourse(courseId: string, indexOffset: number)
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
    public selectGradingPeriod(command: string)
    {
        this.gradingPeriod = command;
        this.$cookies.set('va.grading-period', command, '10y');

        // Call event
        this.$emit('select-time', this.getSelectedGradingPeriod());
    }

    /**
     * Get code for selected time
     */
    public getSelectedGradingPeriod(): number
    {
        if (this.gradingPeriod == 'All Year') return -1;
        else return +this.gradingPeriod.replace('Term ', '') - 1;
    }
}
