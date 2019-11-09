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
}
