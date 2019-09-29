import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import GraphAverage from '@/pages/overall/graph-average/graph-average';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';

@Component({
    components: {GraphOverall, GraphAverage}
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
