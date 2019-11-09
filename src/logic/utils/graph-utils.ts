import Constants from '@/constants';

export default class GraphUtils
{
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
    static getGradeMarkAreas()
    {
        return {
            silent: true,
            data:
            [
                // Above 100
                [{itemStyle: {color: 'rgba(230,253,255,0.09)'}, yAxis: 120}, {yAxis: 100}],
                // 90 to 100
                [{itemStyle: {color: 'rgba(241,255,237,0.09)'}, yAxis: 100}, {yAxis: 90}],
                // 80 to 90
                [{itemStyle: {color: 'rgba(255,250,216,0.09)'}, yAxis: 90}, {yAxis: 80}],
                // 70 to 80
                [{itemStyle: {color: 'rgba(255,225,199,0.1)'}, yAxis: 80}, {yAxis: 70}],
                // Below 70 (Fail)
                [{itemStyle: {color: 'rgb(255,190,184, 0.09)'}, yAxis: 70}, {yAxis: -100}]
            ]
        }
    }
}