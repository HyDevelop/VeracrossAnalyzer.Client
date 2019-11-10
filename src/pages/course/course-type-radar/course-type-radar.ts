import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {FormatUtils} from '@/logic/utils/format-utils';
import moment from 'moment';
import Course, {Assignment} from '@/logic/course';

@Component
export default class CourseTypeRadar extends Vue
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
            // Color
            color: Constants.THEME.colors,

            // Title
            title:
            {
                show: true,
                textStyle:
                {
                    fontSize: 13
                },
                text: 'Assignment Types',
                subtext: 'Assignment type weights for ' + this.course.name,
                x: 'center'
            },

            radar:
            {
                // shape: 'circle',
                name:
                {
                    textStyle:
                    {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: this.course.assignmentTypes.map(t => {return {name: t.name, max: t.scoreMax}})
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
                        value: this.course.assignmentTypes.map(t => t.score)
                    }
                ]
            }
        };

        return settings;
    }
}
