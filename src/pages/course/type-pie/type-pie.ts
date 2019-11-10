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
            ...GraphUtils.getBaseSettings('Type Radar',
                'Assignment type grades for ' + this.course.name),

            tooltip: {},

            // Data
            series:
            {
                type: 'radar',
                data:
                [
                    {
                        name: 'Score',
                        symbol: 'circle',
                        areaStyle:
                        {
                            color:
                            {
                                type: 'radial',
                                x: 0.5, y: 0.6, r: 0.5,
                                colorStops:
                                [
                                    {offset: 0, color: '#ffa0a0'},
                                    {offset: 0.5, color: '#fffead'},
                                    {offset: 1, color: '#d1ffde'}
                                ],
                                global: false // 缺省为 false
                            },
                            opacity: 0.2
                        },
                        value: this.course.assignmentTypes.map(t => t.percent)
                    }
                ]
            },

            color: '#6771c1'
        };

        return settings;
    }
}
