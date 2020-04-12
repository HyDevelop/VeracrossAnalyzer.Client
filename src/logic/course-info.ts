
export default class CourseInfo
{
    id_ci: number
    year: number
    name: string
    teacher: string
    level: string
    courseIds: number[]

    uniqueName: string
    courseCount: number
    gradeLevels: number[]

    /**
     * Construct with a json object
     *
     * @param json
     */
    constructor(json: any)
    {
        this.id_ci = json.id_ci
        this.year = json.year
        this.name = json.name.trim()
        this.teacher = json.teacher
        this.level = json.level
        this.courseIds = json.courseIds.split('|').map((id: string) => +id);

        this.courseCount = this.courseIds.length;
        this.gradeLevels = [];
        this.uniqueName = this.name
            .replace(/( Semester| Full Year|)/g, '')
            .replace(/( Accelerated| Honors| College Prep|)/g, '')
            .replace(/( A| Acc| CP| H| \(.*\))$/g, '')
    }
}

export interface UniqueCourse
{
    name: string
    courses: CourseInfo[]
}
