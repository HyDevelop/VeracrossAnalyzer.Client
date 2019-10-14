import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
    components: {}
})
export default class Loading extends Vue
{
    // @ts-ignore
    @Prop() text: string;
}
