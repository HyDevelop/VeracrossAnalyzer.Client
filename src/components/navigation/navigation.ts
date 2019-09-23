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
    public activeIndex: string = 'overall';

    @Prop() courses: any;

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
