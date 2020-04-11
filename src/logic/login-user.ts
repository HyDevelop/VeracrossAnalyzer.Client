const md5 = require('md5');

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
    graduationYear: number;
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
        this.graduationYear = +json.graduationYear;
        this.groups = json.groups;
        this.emails = json.emails.split('|').map((e: any) => e.toLowerCase().trim());
        this.classes = json.classes.split('|');
        this.birthday = json.birthday;
        this.avatarUrl = json.avatarUrl;
        this.token = json.token;

        // Generate default avatar
        if (this.avatarUrl == null || this.avatarUrl == '')
        {
            this.avatarUrl = `https://www.gravatar.com/avatar/${md5(this.emails[0])}?d=404` + encodeURIComponent(
                `https://ui-avatars.com/api/${this.firstName.charAt(0)}${this.lastName.charAt(0)}/128`);
        }
    }
}
