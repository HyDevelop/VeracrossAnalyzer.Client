
export default class LoginUser
{
    id: number;
    schoolPersonPk: number;
    username: string;
    lastLogin: Date;
    firstLogin: Date;
    firstName: string;
    lastName: string;
    nickname: string;
    graduationYear: string;
    groups: string;
    emails: string[];
    classes: string[];
    birthday: string;
    avatarUrl: string;
    token: string;

    constructor(json: any)
    {
        this.id = json.id;
        this.schoolPersonPk = json.schoolPersonPk;
        this.username = json.username;
        this.lastLogin = new Date(json.lastLogin);
        this.firstLogin = new Date(json.firstLogin);
        this.firstName = json.firstName;
        this.lastName = json.lastName;
        this.nickname = json.nickname;
        this.graduationYear = json.graduationYear;
        this.groups = json.groups;
        this.emails = json.emails.split('|');
        this.classes = json.classes.split('|');
        this.birthday = json.birthday;
        this.avatarUrl = json.avatarUrl;
        this.token = json.token;
    }
}
