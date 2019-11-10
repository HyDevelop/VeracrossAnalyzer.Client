import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {FormatUtils} from '@/logic/utils/format-utils';
import moment from 'moment';
import Course, {Assignment} from '@/logic/course';
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
            ...GraphUtils.getBaseSettings('Type Weight',
                'Assignment type weights for ' + this.course.name),

            tooltip: {},

            // Data
            series:
            {
                type: 'pie',
                data: this.course.assignmentTypes
                    .map(t => {return {value: t.weight, name: t.name}})
                    .sort((a, b) => a.value - b.value)
            }
        };

        return settings;
    }
}
