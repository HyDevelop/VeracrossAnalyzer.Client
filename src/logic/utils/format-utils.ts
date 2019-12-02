export class FormatUtils
{
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
