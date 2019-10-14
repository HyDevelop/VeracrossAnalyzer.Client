<template>
    <div id="loading">
        <div id="text">
            {{error ? 'Error' : 'Loading'}}

            <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                    <circle cx="50" cy="50" r="20" fill="none" class="path" />
                </svg>
            </div>
        </div>

        <div id="details">
            <span v-for="(line, index) in getText()" :style="`font-size: ${16 - getText().length + index}px;`">
                {{line}}
                <br>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class Loading extends Vue
    {
        // @ts-ignore
        @Prop() text: string;

        // @ts-ignore
        @Prop() error: boolean;

        getText()
        {
            return this.text.split('\n');
        }
    }
</script>

<style scoped>
    #loading
    {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #00000065;

        text-align: center;
    }

    #text
    {
        color: white;

        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 46px;
    }

    #details
    {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;

        margin-top: -5px;
        font-size: 16px;
        color: #eeeeee;
    }

    .el-loading-spinner
    {
        top: unset !important;
        margin-top: 0 !important;
        width: unset !important;
        position: unset !important;
    }

    .el-loading-spinner .path
    {
        stroke: white;
    }
</style>
