
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
        this.name = unescape(json.name.trim())
        this.teacher = json.teacher
        this.level = json.level
        this.courseIds = json.courseIds.split('|').map((id: string) => +id);

        this.uniqueName = this.name.replace(/( A| CP| H)$/g, '')
        this.courseCount = this.courseIds.length;
        this.gradeLevels = [];
    }
}

export interface UniqueCourse
{
    name: string
    courses: CourseInfo[]
}
