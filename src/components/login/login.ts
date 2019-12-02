import {Component, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import App from '@/components/app/app';
import VersionUtils from '@/logic/utils/version-utils';
import LoginUser from '@/logic/login-user';

/**
 * This component handles user login, and obtains data from the server.
 */
@Component
export default class Login extends Vue
{
    username = '';
    password = '';

    loading = false;
    error = '';

    disableInput = false;

    /**
     * This is called when the instance is created.
     */
    created()
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
                // Show loading
                this.disableInput = this.loading = true;

                // Login with token TODO: Logout if expired
                this.login('/login/token', {token: this.$cookies.get('va.token')});
            }
        }
        else console.log('Cookies doesn\'t exist');
    }

    /**
     * Check version number
     *
     * @returns boolean Need to clear cookies or not
     */
    needToUpdateCookies(): boolean
    {
        // Version doesn't exist
        if (!this.$cookies.isKey('va.version')) return true;

        // If the current version is less than the min supported version
        return VersionUtils.compare(this.$cookies.get('va.version'), Constants.MIN_SUPPORTED_VERSION) == -1;
    }

    /**
     * When the user clicks, send the username and password to the server.
     */
    onLoginClick()
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
                // TODO: Maintenance
                // Save token to cookies
                this.$cookies.set('va.token', response.data.user.token, '27d');
                this.$cookies.set('va.version', Constants.VERSION, '27d');

                // Call a custom event with the token
                this.$emit('login:user', new LoginUser(response.data.user));
            }
            else
            {
                // Show error message & allow user to retry
                this.error = response.data;
                this.disableInput = this.loading = false;
            }
        })
        .catch(err =>
        {
            // Show error message & allow user to retry
            this.error = err;
            this.disableInput = this.loading = false;
        });
    }

    /**
     * This is called when the user hits enter on the input boxes.
     */
    onEnter()
    {
        this.onLoginClick();
    }

    /**
     * Clear cookies
     */
    clearCookies()
    {
        this.$cookies.keys().forEach(key => this.$cookies.remove(key));
    }
}
