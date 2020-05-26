import {GPAUtils} from '@/logic/utils/gpa-utils';
import Course from '@/logic/course';

const md5 = require('md5');

export default class LoginUser
{
    id: number
    schoolPersonPk: number
    username: string
    lastLogin: Date
    firstLogin: Date
    firstName: string
    lastName: string
    graduationYear: number
    emails: string[]
    classes: string[]
    avatarUrl: string

    token: string
    courses: Course[]

    gradeLevel: number
    gradeLevelName: string

    constructor(jsonData: any)
    {
        let json = jsonData.user
        this.id = json.id;
        this.schoolPersonPk = json.schoolPersonPk;
        this.username = json.username;
        this.lastLogin = new Date(json.lastLogin);
        this.firstLogin = new Date(json.firstLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.graduationYear = +json.graduationYear;
        this.emails = json.emails.split('|').map((e: any) => e.toLowerCase().trim());
        this.classes = json.classes.split('|');
        this.avatarUrl = json.avatarUrl;

        // Extracted in newer versions
        this.token = jsonData.token;
        this.courses = jsonData.courses.map((courseJson: any) => new Course(courseJson));

        // Calculated grade level
        this.gradeLevel = GPAUtils.getGradeLevel(this.graduationYear);
        this.gradeLevelName = GPAUtils.gradeLevelName(this.gradeLevel);

        // Generate default avatar
        if (this.avatarUrl == null || this.avatarUrl == '')
        {
            this.avatarUrl = `https://www.gravatar.com/avatar/${md5(this.emails[0])}?d=404` + encodeURIComponent(
                `https://ui-avatars.com/api/${this.firstName.charAt(0)}${this.lastName.charAt(0)}/128`);
        }
    }
}
