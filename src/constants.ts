/**
 * This class stores the static constants.
 */
import {findLastIndex} from '@/logic/utils/general-utils';

export default class Constants
{
    /** Base url for api access */
    static API_URL: string = 'https://va.hydev.org/api';
    // static API_URL: string = 'http://localhost:24021/api';

    /** Current version */
    static VERSION: string = '0.5.6.1761';

    /** The minimum version that still supports the same cookies */
    static MIN_SUPPORTED_VERSION: string = '0.4.6.1087';

    static GITHUB: string = 'https://github.com/HyDevelop/VeracrossAnalyzer.Client';

    static SPLASH: string =
        '.    ,        ,---.          |                        \n' +
        '|    |.  ,    |---|,---.,---.|    ,   .,---,,---.,---.\n' +
        ' \\  /  ><     |   ||   |,---||    |   | .-\' |---\'|    \n' +
        '  `\'  \'  `    `   \'`   \'`---^`---\'`---|\'---\'`---\'`    \n' +
        '                                  `---\'               \n' +
        ` Version v${Constants.VERSION} by Hykilpikonna (YGui21)\n` +
        ` Github: ${Constants.GITHUB}`;

    // Graph Theme
    static THEME =
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

    // Terms IMPORTANT: Update them every year! https://www.stjohnsprep.org/page.cfm?p=8267
    // TODO: Update terms automatically
    static TERMS =
    [
        new Date('Sep 09 2021'), // Sep 14 2020, Sep 04 2019
        new Date('Nov 06 2021'), // Nov 14 2020, Nov 01 2019
        new Date('Jan 22 2022'), // Jan 30 2021, Jan 19 2020
        new Date('Mar 26 2022'), // Apr 02 2021, Mar 22 2020
        new Date('Jun 06 2022'), // Jun 04 2021, Jun 05 2020
    ];
    static CURRENT_TERM = Constants.getTerm(new Date());

    /**
     * Find out the specified date is in which term
     *
     * @param date
     */
    static getTerm(date: Date)
    {
        return findLastIndex(Constants.TERMS, d => d <= date);
    }
}
