import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {Course} from '@/components/app/app';
import {CourseUtils} from '@/utils/course-utils';

/**
 * This component is the top navigation bar
 */
@Component({
    components: {},
})
export default class Navigation extends Vue
{
    // @ts-ignore
    @Prop() activeIndex: string;

    // @ts-ignore
    @Prop() courses: Course[];

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Set history state
        let url = window.location.pathname;
        if (url == '/' || url == '') url = '/overall';
        window.history.replaceState({lastTab: url.substring(1)}, '', url);

        // Update initial index
        this.updateIndex(url.substring(1));

        // Create history state listener
        window.onpopstate = e =>
        {
            if (e.state)
            {
                // Restore previous tab
                console.log(`onPopState: Current: ${this.activeIndex}, Previous: ${e.state.lastTab}`);
                this.updateIndex(e.state.lastTab);
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

        // Debug output TODO: Remove this
        console.log(`onNavigate: Previous: ${this.activeIndex}, New: ${index}`);

        // Check url
        let url = `/${index}`;

        // Push history state
        window.history.pushState({lastTab: index}, '', url);
    }

    /**
     * Update index
     *
     * @param newIndex New index
     */
    private updateIndex(newIndex: string)
    {
        this.$emit('update:activeIndex', newIndex);
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
        // Find current course
        let courseId = this.activeIndex.split('/')[1];

        // Find current course index
        let courseIndex = this.courses.findIndex(c => c.id == +courseId);

        // Find next course
        return this.courses[courseIndex + indexOffset];
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
