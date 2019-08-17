import {Component, Vue} from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Login extends Vue
{
    public username: any = '';
    public password: any = '';
}
