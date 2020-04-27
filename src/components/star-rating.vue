<template>
    <div class="background">
        <span :style="{width: (score / 5 * 100).toFixed(2) + '%'}" class="rating"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class StarRating extends Vue
    {
        @Prop({required: true}) score: number;
    }
</script>

<style lang="scss" scoped>
    .background
    {
        background: url("./star-rating-sprite.png") repeat-x;
        font-size: 0;
        height: 21px;
        line-height: 0;
        overflow: hidden;
        width: 110px;
        margin: 0 auto;

        span.rating
        {
            background: url("./star-rating-sprite.png") repeat-x 0 100%;
            float: left;
            height: 21px;
            display: block;
        }
    }
</style>
