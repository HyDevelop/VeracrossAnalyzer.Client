import {Component, Vue} from 'vue-property-decorator';

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
     * On click
     */
    public onLoginClick()
    {

    }
}
