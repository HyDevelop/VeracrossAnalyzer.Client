<template>
    <div id="info">
        <div id="top">
            <div id="title">Veracross Analyzer for SJP</div>
            <div id="subtitle">Know your grades better.</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Info extends Vue
    {

    }
</script>

<style lang="scss" scoped>
    #top
    {
        padding: 40vh 0;

        // Center and scale the image nicely
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        text-align: right;

        #title
        {
            font-size: 30px;
            margin-right: 10vw;
            color: white;
        }

        #subtitle
        {
            margin-right: 10vw;
            color: white;
        }
    }
</style>
