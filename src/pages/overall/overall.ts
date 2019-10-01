import {Component, Prop, Vue} from 'vue-property-decorator';
import OverallLine from '@/pages/overall/overall-line/overall-line';
import GraphAverage from '@/pages/overall/graph-average/graph-average';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
    components: {OverallLine, GraphAverage}
})
export default class Overall extends Vue
{
    // @ts-ignore
    @Prop({required: true}) courses: Course[];

    /**
     * This function is called to get gpa since I can't import another
     * class in the Vue file.
     */
    public getGPA()
    {
        return GPAUtils.getGPA(this.courses);
    }
}
