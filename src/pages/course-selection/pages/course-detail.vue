<template>
    <div id="course-detail">

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo from '@/logic/course-info';

    @Component
    export default class CourseDetail extends Vue
    {
        @Prop({required: true}) courseInfo: CourseInfo;
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>

</style>
