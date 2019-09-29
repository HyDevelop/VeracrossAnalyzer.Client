import {Component, Prop, Vue} from 'vue-property-decorator';
import {Course} from '@/components/app/app';

@Component({
})
export default class GraphOverall extends Vue
{
    @Prop({required: true}) chart: any;

    private settings =
    {
        // Title
        title:
        {
            show: false,
            textStyle:
            {
                fontSize: 12
            },
            text: 'Your average score graph all time'
        },
        series:
        {
            smooth: false
        },
        yAxis:
        {
            min: 70
        }
    }
}
