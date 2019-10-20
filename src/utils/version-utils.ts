export default class VersionUtils
{
    /**
     * Compare two version numbers
     *
     * Eg.
     *   compare('0.1.2', '0.1.3') = -1
     *   compare('1.0.0', '0.1.3') = 1
     *   compare('0.0.1', '0.0.1') = 0;
     *
     * @param ver1 Version 1
     * @param ver2 Version 2
     * @return number (-1 if ver1 < ver2), (1 if ver1 > ver2), (0 if equal)
     */
    public static compare(ver1: string, ver2: string): number
    {
        // Equal case
        if (ver1 == ver2) return 0;

        // Split
        let split1 = ver1.split('.');
        let split2 = ver2.split('.');

        // Detect each number
        for (let i in split1)
        {
            // Get numbers
            let num1 = split1[i];
            let num2 = split2[i];

            // Current number is equal
            if (num1 == num2) continue;

            // Current number is different
            return +num1 < +num2 ? -1 : 1;
        }

        // Equal
        return 0;
    }
}
