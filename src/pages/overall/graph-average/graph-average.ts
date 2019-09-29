import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';

@Component({
})
export default class GraphOverall extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    private settings =
    {
    };

    /**
     * Convert assignments list to a graph dataset.
     */
    get convertChart()
    {
        let courses = this.courses;

        return {
        }
    }
}
