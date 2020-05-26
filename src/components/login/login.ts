import {Component, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import App from '@/components/app/app';
import VersionUtils from '@/logic/utils/version-utils';
import LoginUser from '@/logic/login-user';
import Maintenance from '@/components/overlays/maintenance.vue';

/**
 * This component handles user login, and obtains data from the server.
 */
@Component({components: {Maintenance}})
export default class Login extends Vue
{
    username = '';
    password = '';

    loading = false;
    error = '';

    disableInput = false;

    maintenance = '';

    /**
     * This is called when the instance is created.
     */
    created()
    {
        // TODO: Check maintenance

        // Check login cookies
        if (this.$cookies.isKey('va.token'))
        {
            // Check cookies version
            if (this.needToUpdateCookies()) this.clearCookies();
            else
            {
                // Show loading
                this.disableInput = this.loading = true;

                // Login with token
                this.login('/login/token', {token: this.$cookies.get('va.token')});
            }
        }
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
     * When the user clicks, post the login request and process the response
     * This is also called when the user hits enter on the input boxes.
     */
    loginClick()
    {
        // Make login button loading
        this.loading = true;

        // Format it
        this.username = this.username.toLowerCase().replace(/ /g, '').replace(/@.*/g, '');

        // Actually login
        this.login('/login', {username: this.username, password: this.password})
    }

    /**
     * Actually post the request and process the response
     */
    login(url: string, data: any)
    {
        // Fetch request
        App.http.post(url, data).then(response =>
        {
            // Check success
            if (response.success)
            {
                // Save token to cookies
                this.$cookies.set('va.token', response.data.token, '27d');
                this.$cookies.set('va.version', Constants.VERSION, '27d');

                // Call a custom event with the token
                this.$emit('login:user', new LoginUser(response.data));
            }
            else
            {
                // Login expired -> clear cookies
                if (response.data == 'Error: Login expired')
                {
                    this.clearCookies();
                }

                // Show error message & allow user to retry
                // TODO: Automatic report error
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
     * Clear cookies
     */
    clearCookies()
    {
        this.$cookies.keys().forEach(key => this.$cookies.remove(key));
    }
}
