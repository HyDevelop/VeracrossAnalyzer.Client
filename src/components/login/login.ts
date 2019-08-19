import {Component, Vue} from 'vue-property-decorator';
import Constants from '@/constants';

/**
 * This component handles user login, and obtains data from the server.
 */
@Component({
    components: {},
})
export default class Login extends Vue
{
    public username: any = '';
    public password: any = '';

    /**
     * On click, sends username and password to the server.
     */
    public onLoginClick()
    {
        // Call custom event
        this.$emit('login:click', this.username, this.password);

        // Fetch request TODO: Add username and password when the server is ready.
        fetch(`${Constants.API_URL}/veracross/courses`).then(res =>
        {
            // Get response body text
            res.text().then(text =>
            {
            })
        })
        .catch(alert);
    }
}
