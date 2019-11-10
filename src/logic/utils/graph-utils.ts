import Constants from '@/constants';

export default class GraphUtils
{
    static DOT = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:{color}"></span>';

    /**
     * Base settings
     *
     * @param title
     * @param subtitle
     */
    static getBaseSettings(title?: String, subtitle?: String)
    {
        return {
            // Color
            color: Constants.THEME.colors,

            // Title
            title:
            {
                show: title != null,
                textStyle:
                {
                    fontSize: 13
                },
                text: title,
                subtext: subtitle,
                x: 'center'
            },
        }
    }

    /**
     * Get term mark lines
     */
    static getTermLines()
    {
        return {
            silent: true,
            symbol: 'none',
            lineStyle: {color: Constants.THEME.colors[2]},
            animationDuration: 500,
            data: Constants.TERMS.map((term, index) =>
            {
                return {xAxis: term.getTime(), label: {formatter: `Term ${index + 1}`}}
            })
        }
    }

    /**
     * Get mark areas for percentage scores
     */
    static getGradeMarkAreas(opacity: number)
    {
        return {
            silent: true,
            data:
            [
                // Above 100
                [{itemStyle: {color: 'rgba(230,253,255)', opacity: opacity}, yAxis: 120}, {yAxis: 100}],
                // 90 to 100
                [{itemStyle: {color: 'rgba(241,255,237)', opacity: opacity}, yAxis: 100}, {yAxis: 90}],
                // 80 to 90
                [{itemStyle: {color: 'rgba(255,250,216)', opacity: opacity}, yAxis: 90}, {yAxis: 80}],
                // 70 to 80
                [{itemStyle: {color: 'rgba(255,225,199)', opacity: opacity}, yAxis: 80}, {yAxis: 70}],
                // Below 70 (Fail)
                [{itemStyle: {color: 'rgb(255,190,184)', opacity: opacity}, yAxis: 70}, {yAxis: -100}]
            ]
        }
    }

    /**
     * Text style for pie graphs or radar graphs
     */
    static pieTextStyle()
    {
        return {
            fontSize: 14,
            textShadowColor: '#cfcfcf',
            textShadowBlur: 2,
            textShadowOffsetX: 1,
            textShadowOffsetY: 1,
            backgroundColor: '#f6f6f6',
            borderRadius: 3,
            padding: [3, 5]
        }
    }
}
