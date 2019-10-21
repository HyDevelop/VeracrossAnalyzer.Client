import moment from 'moment';

export class FormatUtils
{
    /**
     * Convert date format to yyyy-mm-dd
     *
     * @param _date Date
     */
    public static toChartDate(_date: string | Date)
    {
        // Convert to Date
        let date: Date = _date instanceof Date ? _date : new Date(_date);

        // Convert to yyyy-mm-dd
        return moment(date).format('YYYY-MM-DD');
    }

    /**
     * Limit string length
     *
     * @param str String
     * @param length Max length
     */
    static limit(str: string, length: number): string
    {
        return str.length <= length ? str : str.substr(0, length - 2) + '...'
    }
}
