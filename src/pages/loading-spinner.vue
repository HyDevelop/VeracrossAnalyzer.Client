<template>
    <div class="el-loading-spinner">
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
        @Prop({default: 42}) size: number
    }
</script>

<style lang="scss" scoped></style>
