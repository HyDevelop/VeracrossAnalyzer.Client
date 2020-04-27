<template>
    <div class="el-loading-spinner" :class="{'not-centered': !centered}">
        <svg viewBox="25 25 50 50" class="circular" :style="{width: size + 'px', height: size + 'px'}">
            <circle cx="50" cy="50" r="20" fill="none" class="path"/>
        </svg>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class LoadingSpinner extends Vue
    {
        @Prop({default: '42'}) size: string
        @Prop({default: true}) centered: string
    }
</script>

<style lang="scss" scoped>
    .not-centered
    {
        top: unset;
        margin-top: unset;
        width: unset;
        text-align: unset;
        position: unset;
    }
</style>
