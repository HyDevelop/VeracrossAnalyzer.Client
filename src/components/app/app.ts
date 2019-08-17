import {Component, Vue} from 'vue-property-decorator';
import Login from '@/components/login/login';

@Component({
    components: {Login},
})
export default class App extends Vue
{
}
