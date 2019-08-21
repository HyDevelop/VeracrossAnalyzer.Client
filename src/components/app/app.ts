import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';

@Component({
    components: {Login},
})
export default class App extends Vue
{
    public showLogin: boolean = true;

    /**
     * This is called when the user logs in.
     *
     * @param courses Courses Json
     */
    public onLogin(courses: any)
    {
        // Hide login bar
        this.showLogin = false;
    }
}
