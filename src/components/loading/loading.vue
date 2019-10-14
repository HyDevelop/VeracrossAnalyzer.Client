<template>
    <div id="loading">
        <div id="text" :class="message()">
            {{message()}}

            <div v-if="!error" class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                    <circle cx="50" cy="50" r="20" fill="none" class="path" />
                </svg>
            </div>

            <div v-if="error" id="error-details">
                <span v-for="(line, index) in getText()" :style="`font-size: ${-index === 0 ? 16 : 12}px;`">
                    {{line}}
                    <br>
                </span>
            </div>
        </div>

        <div v-if="!error" id="details">
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

        message()
        {
            return this.error ? 'Error' : 'Loading';
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
        box-shadow: inset 0 0 1px 1px rgba(0,0,0,.1);
        background: -webkit-linear-gradient(left, rgba(95, 18, 72, 0.4), rgba(42, 81, 117, 0.4) 100%);

        text-align: center;
    }

    .Error
    {
        color: #ffdddd !important;
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
        color: #f9f9f9;
    }

    #error-details
    {
        font-size: 16px;
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
