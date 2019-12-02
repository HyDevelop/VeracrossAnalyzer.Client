<template>
    <div id="maintenance">
        <h1>We&rsquo;ll be back soon!</h1>
        <div>
            <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.
                We&rsquo;ll be back online shortly!</p>
            <p>&mdash; Veracross Analyzer</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Maintenance extends Vue
    {
        @Prop({required: true}) message: any;
    }
</script>

<style scoped>
    body {text-align: center; padding: 150px;}
    h1 {font-size: 50px;}
    body {font: 20px Helvetica, sans-serif; color: #333;}
    article {display: block; text-align: left; width: 650px; margin: 0 auto;}
    a {color: #dc8100; text-decoration: none;}
    a:hover {color: #333; text-decoration: none;}
</style>
