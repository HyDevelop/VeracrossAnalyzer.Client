/**
 * This class stores the static constants.
 */
export default class Constants
{
    /**
     * Base url for api access
     */
    public static API_URL: string = 'https://va.hydev.org/api';

    public static VERSION: string = '0.3.2.452';

    public static GITHUB: string = 'https://github.com/HyDevelop/VeracrossAnalyzer.Client';

    public static SPLASH: string =
        '.    ,        ,---.          |                        \n' +
        '|    |.  ,    |---|,---.,---.|    ,   .,---,,---.,---.\n' +
        ' \\  /  ><     |   ||   |,---||    |   | .-\' |---\'|    \n' +
        '  `\'  \'  `    `   \'`   \'`---^`---\'`---|\'---\'`---\'`    \n' +
        '                                  `---\'               \n' +
        ` Version v${Constants.VERSION} by Hykilpikonna (YGui21)\n` +
        ` Github: ${Constants.GITHUB}`;

    // Graph Theme
    public static THEME =
    {
        // Colors
        colors:
        [
            '#18cea5',
            '#4fa8ed',
            '#f9627b',
            '#ffb075',
            '#005c9c',
            '#bcabe0',
            '#d36e75',
            '#fc97af',
            '#919e8b',
            '#d7ab82',
            '#6e7074',
            '#61a0a8',
            '#efa18d',
            '#787464',
            '#cc7e63',
            '#724e58',
            '#4b565b'
        ]
    }
}
