import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';
import Navigation from '@/components/navigation/navigation';

@Component({
    components: {Login, Navigation},
})
export default class App extends Vue
{
    public showLogin: boolean = true;

    public courses = null;

    /**
     * This is called when the user logs in.
     *
     * @param courses Courses Json
     */
    public onLogin(courses: any)
    {
        // Hide login bar
        this.showLogin = false;

        // Assign courses
        this.courses = courses;

        // Debug output TODO: Remove this
        console.log(courses);
    }

    /**
     * This is called when a navigation tab is clicked
     *
     * @param tab Tab name
     */
    public onNavigate(tab: string)
    {
        // Debug output TODO: Remove this
        console.log(tab);
    }
}
