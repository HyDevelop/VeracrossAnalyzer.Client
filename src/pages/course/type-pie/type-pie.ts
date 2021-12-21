import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import Course from '@/logic/course';
import GraphUtils from '@/logic/utils/graph-utils';

@Component
export default class TypePie extends Vue
{
    @Prop({required: true}) course: Course;

    /**
     * Override options
     *
     * @param options Original options (Unused)
     */
    afterConfig(options: any)
    {
        return this.chartSettings;
    }

    /**
     * Generate settings
     */
    get chartSettings()
    {
        // Create settings
        let settings =
        {
            ...GraphUtils.getBaseSettings('Assignment Type Weight',
                'How much each type of assignment affect your average'),

            // Data
            series:
            {
                type: 'pie',
                avoidLabelOverlap: false,
                radius: ['40%', '60%'],
                center: ['50%', '55%'],
                label: GraphUtils.pieTextStyle(),
                data: this.course.assignmentTypes().map((t, i) => {return {
                    value: t.weight,
                    name: `${t.name}\n${t.weight}%`,
                    itemStyle:
                    {
                        color: Constants.THEME.colors[i],
                        opacity: 0.8,
                        shadowColor: 'rgba(0,0,0,0.22)',
                        shadowBlur: 10
                    }
                }}).sort((a, b) => a.value - b.value)
            }
        };

        return settings;
    }
}
