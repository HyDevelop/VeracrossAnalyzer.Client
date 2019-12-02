import {Component, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import App from '@/components/app/app';
import VersionUtils from '@/logic/utils/version-utils';

/**
 * This component handles user login, and obtains data from the server.
 */
@Component({
    components: {},
})
export default class Login extends Vue
{
    public username: string = '';
    public password: string = '';

    public loading: boolean = false;
    public error: string = '';

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Check login cookies
        if (this.$cookies.isKey('va.token'))
        {
            // Check cookies version
            if (this.needToUpdateCookies())
            {
                console.log('Version Updated! Clearing cookies...');

                // Clear all cookies
                this.$cookies.keys().forEach(key => this.$cookies.remove(key));
            }
            else
            {
                // Already contains valid token / TODO: Validate
                // TODO: Update token each access
                this.$emit('login:token', this.$cookies.get('va.token'));
            }
        }
        else
        {
            console.log('Cookies doesn\'t exist');
        }
    }

    /**
     * Check version number
     *
     * @returns boolean Need to clear cookies or not
     */
    public needToUpdateCookies(): boolean
    {
        // Version doesn't exist
        if (!this.$cookies.isKey('va.version')) return true;

        // If the current version is less than the min supported version
        return VersionUtils.compare(this.$cookies.get('va.version'), Constants.MIN_SUPPORTED_VERSION) == -1;
    }

    /**
     * When the user clicks, send the username and password to the server.
     */
    public onLoginClick()
    {
        // Make login button loading
        this.loading = true;

        // Format it
        this.username = this.username.toLowerCase().replace(/ /g, '').replace(/@.*/g, '');

        // Login
        this.login('/login', {username: this.username, password: this.password});
    }

    /**
     * Actually post the login request and process the response
     *
     * @param url Posting url
     * @param data Data to be posted
     */
    login(url: string, data: any)
    {
        // Fetch request
        App.http.post(url, data)
        .then(response =>
        {
            // Check success
            if (response.success)
            {
                // Save token to cookies
                this.$cookies.set('va.token', response.data, '27d');
                this.$cookies.set('va.version', Constants.VERSION, '27d');

                // Call custom event with token
                this.$emit('login:token', response.data);
            }
            else
            {
                // Show error message
                this.error = response.data;

                // Allow the user to retry
                this.loading = false;
            }
        })
        .catch(err =>
        {
            // TODO: Show error properly
            alert(err);

            // Allow the user to retry
            this.loading = false;
        });
    }

    /**
     * This is called when the user hits enter on the input boxes.
     */
    public onEnter()
    {
        this.onLoginClick();
    }
}
