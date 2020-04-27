import {Component, Prop, Vue} from 'vue-property-decorator';
import Course from '@/logic/course';
import Constants from '@/constants';
import LoginUser from '@/logic/login-user';
import NavController from '@/logic/nav-controller';
import App from '@/components/app/app.ts';

/**
 * This component is the top navigation bar
 */
@Component
export default class Navigation extends Vue
{
    @Prop({required: true}) app: App;
    @Prop({required: true}) nav: NavController;
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
        Navigation.instance = this;
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
        try
        {
            // Is json
            this.nav.updateIndex(JSON.parse(index))
        }
        catch (e)
        {
            // Not json
            this.nav.updateIndex(index);
        }
    }

    /**
     * Move to the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    nextCourse(indexOffset: number)
    {
        // Set tab to the next index
        this.nav.updateIndex(this.findNextCourse(indexOffset).urlIndex)
    }

    /**
     * Find the next course
     *
     * @param indexOffset Index offset (Eg. 1 for next)
     */
    findNextCourse(indexOffset: number)
    {
        return this.findCourse(this.nav.info.id, indexOffset);
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
        let courseIndex = this.app.gradedCourses.findIndex(c => c.id == +courseId);

        // Find next course
        return this.app.gradedCourses[courseIndex + indexOffset];
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
            case 'switch-dark':
            {
                this.app.darkMode = !this.app.darkMode;

                if (this.app.darkMode) this.$cookies.set('dark', true);
                else this.$cookies.remove('dark');

                break
            }
        }

    }

    get version() {return Constants.VERSION}
}
