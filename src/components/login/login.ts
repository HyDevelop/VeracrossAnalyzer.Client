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

    public loading: boolean = false;

    /**
     * On click, sends username and password to the server.
     */
    public onLoginClick()
    {
        // Call custom event
        this.$emit('login:click', this.username, this.password);

        // Make login button loading
        this.loading = true;

        // Fetch request TODO: Add username and password when the https server is ready.
        fetch(`${Constants.API_URL}/veracross/courses`).then(res =>
        {
            // Get response body text
            res.text().then(text =>
            {
                // Disable loading
                this.loading = false;

                // Call custom event with courses info
                this.$emit('login:courses', JSON.parse(text));
            })
        })
        .catch(alert);
    }
}
