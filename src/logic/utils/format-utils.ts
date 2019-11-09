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
    public static limit(str: string, length: number): string
    {
        return str.length <= length ? str : str.substr(0, length - 2) + '...'
    }

    /**
     * To Title Case
     *
     * @param str oRigInAL sTrING
     * @return string Original String
     */
    public static toTitleCase(str: string)
    {
        return str.replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase())
    }

    /**
     * Parse html text
     *
     * @param str
     */
    public static parseText(str: string): string
    {
        return str.replace(/&amp;/g, '&');
    }
}
