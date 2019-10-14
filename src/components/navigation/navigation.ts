import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';

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

    @Prop() courses: any;

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Show splash TODO: Remove
        console.log('Created Navigation');

        // Set history state (TODO: Dynamically detect initial url
        window.history.replaceState({lastTab: 'overall'}, '', '/overall');

        // Create history state listener
        window.onpopstate = e =>
        {
            if (e.state)
            {
                // Restore previous tab
                console.log(`onPopState: Current: ${this.activeIndex}, Previous: ${e.state.lastTab}`);
                this.activeIndex = e.state.lastTab;
            }
        };
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
        this.activeIndex = index;

        // Call custom event
        this.$emit('navigation:select', this.activeIndex);
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
