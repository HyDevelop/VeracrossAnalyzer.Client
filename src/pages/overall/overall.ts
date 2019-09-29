import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';
import {GPAUtils} from '@/utils/gpa-utils';
import {CourseUtils} from '@/utils/course-utils';

@Component({
    components: {GraphOverall}
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
        let gpa = GPAUtils.getGPA(this.courses);
        // let result = '' + gpa.gpa;

        /* Not accurate
        if (!gpa.accurate)
        {
            result = `(${result})`;
        }*/

        return gpa;
    }
}
