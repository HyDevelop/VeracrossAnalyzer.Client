import {Component, Prop, Vue} from 'vue-property-decorator';
import Constants from '@/constants';
import {HttpUtils} from '@/utils/http-utils';
import App from '@/components/app/app';
import VersionUtils from '@/utils/version-utils';

/**
 * This component handles user login, and obtains data from the server.
 * TODO: Press enter to login
 */
@Component({
    components: {},
})
export default class Login extends Vue
{
    public username: any = '';
    public password: any = '';

    public loading: boolean = false;
    public error: String = '';

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Check cookies version
        if (this.needToUpdateCookies())
        {
            console.log('Version Updated! Clearing cookies...');

            // Clear all cookies
            this.$cookies.keys().forEach(key => this.$cookies.remove(key));
        }

        // Check login cookies
        if (this.$cookies.isKey('va.token'))
        {
            // Already contains valid token / TODO: Validate
            this.$emit('login:token', this.$cookies.get('va.token'));
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
     * On click, sends username and password to the server.
     */
    public onLoginClick()
    {
        // Make login button loading
        this.loading = true;

        // Fetch request
        App.http.post('/login', {username: this.username, password: this.password})
        .then(response =>
        {
            // Check success
            if (response.success)
            {
                // Save token to cookies
                this.$cookies.set('va.token', response.data, '27d');
                this.$cookies.set('va.version', Constants.VERSION);

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
            alert(err);

            // Allow the user to retry
            this.loading = false;
        });
    }

    /**
     * This is called when the user hits enter in the input boxes.
     */
    public onEnter()
    {
        this.onLoginClick();
    }
}
