<template>
    <div id="course-detail">
        <div class="header">Course: <span style="color: #229fff">{{uniqueCourse.name}}</span></div>
        <el-divider class="divider"><i class="el-icon-reading"></i></el-divider>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo, {UniqueCourse} from '@/logic/course-info';

    @Component
    export default class CourseDetail extends Vue
    {
        @Prop({required: true}) uniqueCourse: UniqueCourse;
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>

</style>
