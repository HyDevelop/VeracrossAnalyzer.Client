<template>
    <div id="maintenance">
        <div id="maintenance-content">
            <h1>We&rsquo;ll be back soon!</h1>
            <div>
                <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment.
                    We&rsquo;ll be back online shortly!</p>
                <p>&mdash; Veracross Analyzer</p>
            </div>
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

<style lang="scss" scoped>
    #maintenance
    {
        z-index: 1000;
        background: white;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        #maintenance-content
        {
            font: 20px Helvetica, sans-serif;
            color: #333;

            display: block;
            text-align: left;
            margin: 150px;

            h1
            {
                font-size: 50px;
            }

            a {color: #dc8100; text-decoration: none;}
            a:hover {color: #333; text-decoration: none;}
        }
    }
</style>
