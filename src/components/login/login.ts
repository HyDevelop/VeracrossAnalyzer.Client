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
    public error: String = '';

    /**
     * This is called when the instance is created.
     */
    public created()
    {
        // Check login cookies
        if (this.$cookies.isKey('va.token'))
        {
            // Already contains valid token / TODO: Validate
            this.$emit('login:token', this.$cookies.get('va.token'));
        }
    }

    /**
     * On click, sends username and password to the server.
     */
    public onLoginClick()
    {
        // Make login button loading
        this.loading = true;

        // Fetch request TODO: Add username and password when the https server is ready.
        fetch(`${Constants.API_URL}/login`,
            {method: 'POST', body: JSON.stringify({username: this.username, password: this.password})})
        .then(res =>
        {
            // Get response body text
            res.text().then(text =>
            {
                // Parse response
                let response = JSON.parse(text);

                // Check success
                if (response.success)
                {
                    // Save token to cookies
                    this.$cookies.set('va.token', response.data, '7d');

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
        })
        .catch(err =>
        {
            alert(err);

            // Allow the user to retry
            this.loading = false;
        });
    }
}
