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
    public activeIndex: string = '0';

    @Prop() courses: any;

    /**
     * This function is called when the selection changes.
     */
    public onSelect()
    {
        // Call custom event
        this.$emit('navigation:select', this.activeIndex);
    }
}
