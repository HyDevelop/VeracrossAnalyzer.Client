/**
 * This class stores the static constants.
 */
export default class Constants
{
    /** Base url for api access */
    public static API_URL: string = 'https://va.hydev.org/api';

    /** Current version */
    public static VERSION: string = '0.4.2.912';

    /** Minimum version that still supports the same cookies */
    public static MIN_SUPPORTED_VERSION: string = '0.3.4.561';

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
            '#19d4ae',
            '#5ab1ef',
            '#fa6e86',
            '#ffb980',
            '#0067a6',
            '#c4b4e4',
            '#d87a80',
            '#9cbbff',
            '#d9d0c7',
            '#87a997',
            '#d49ea2',
            '#5b4947',
            '#7ba3a8',
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
    };

    // Terms (TODO: Actually get the terms dynamically
    public static TERMS =
    [
        new Date('Sep 04 2019'),
        new Date('Nov 03 2019'),
        new Date('Jan 19 2020'),
        new Date('Mar 22 2020'),
        new Date('Jun 05 2020'),
    ];
    public static CURRENT_TERM = 1;
}
