import {Component, Prop, Vue} from 'vue-property-decorator';
import GraphOverall from '@/pages/overall/graph-overall/graph-overall';
import {Course} from '@/components/app/app';

@Component({
    components: {GraphOverall}
})
export default class Overall extends Vue
{
    @Prop({required: true}) courses: any;
}
