import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {FormatUtils} from '@/logic/utils/format-utils';
import moment from 'moment';
import Course, {Assignment} from '@/logic/course';
import GraphUtils from '@/logic/utils/graph-utils';

@Component
export default class TypeRadar extends Vue
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
        let min = this.course.assignmentTypes.reduce((min, t) => Math.min(min, t.percent), 100);

        // Create settings
        let settings =
        {
            ...GraphUtils.getBaseSettings('Assignment Type Radar',
                'How are you doing for different types of assignment'),

            // Radar settings
            radar:
            {
                // shape: 'circle',
                name:
                {
                    textStyle: GraphUtils.pieTextStyle()
                },
                splitArea:
                {
                    areaStyle:
                    {
                        color:
                        [
                            'rgb(255,161,151)',
                            'rgb(255,190,184)',
                            'rgba(255,225,199)',
                            'rgba(255,250,216)',
                            'rgba(241,255,237)',
                        ],
                        opacity: 0.4
                    }
                },
                indicator: this.course.assignmentTypes.map((t, i) => {return {
                    name: `${t.name}\n${t.percent}%`,
                    max: 100,
                    min: min - 30,
                    color: Constants.THEME.colors[i]
                }}),
                radius: '60%',
                center: ['50%', '55%']
            },

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
                                x: 0.5, y: 0.55, r: 0.5,
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
