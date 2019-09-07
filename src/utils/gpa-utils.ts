/**
 * This is an utility class to calculate GPA.
 */
export class GPAUtils
{
    // [[Min score, Letter grade, Base GPA], ...]
    public static SCALE =
    [
        [96.5, 'A+', 4.00],
        [92.5, 'A' , 3.75],
        [89.5, 'A-', 3.50],
        [86.5, 'B+', 3.25],
        [82.5, 'B' , 3.00],
        [79.5, 'B-', 2.75],
        [76.5, 'C+', 2.50],
        [72.5, 'C' , 2.25],
        [70.5, 'C-', 2.00],
        [69.5, 'D' , 1.00],
        [0   , 'F' , 0.00]
    ];
}
