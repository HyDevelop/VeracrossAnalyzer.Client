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
        // Create settings
        let settings =
        {
            ...GraphUtils.getBaseSettings('Type Radar',
                'Assignment type grades for ' + this.course.name),

            // Radar settings
            radar:
            {
                // shape: 'circle',
                name:
                {
                    textStyle:
                    {
                        fontSize: 14,
                        textShadowColor: '#cfcfcf',
                        textShadowBlur: 2,
                        textShadowOffsetX: 1,
                        textShadowOffsetY: 1,
                        color: '#fff',
                        backgroundColor: '#f6f6f6',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
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
                    color: Constants.THEME.colors[i]
                }}),
                radius: '60%',
                center: ['50%', '60%']
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
