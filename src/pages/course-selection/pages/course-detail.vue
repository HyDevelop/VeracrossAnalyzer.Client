<template>
    <div id="course-detail">
        <div class="header">Course: <span style="color: #229fff">{{uniqueCourse.name}}</span></div>
        <el-divider class="divider"><i class="el-icon-reading"></i></el-divider>

        <div class="item" v-for="course in sortedCourses">
            <div>{{course.levelFull}} - <i>{{course.teacher}}</i></div>
            <div class="info">{{course.name}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo, {UniqueCourse} from '@/logic/course-info';

    @Component
    export default class CourseDetail extends Vue
    {
        @Prop({required: true}) uniqueCourse: UniqueCourse;

        get sortedCourses(): CourseInfo[]
        {
            return this.uniqueCourse.courses.sort((a, b) => a.levelID - b.levelID);
        }
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
    .item
    {
        text-align: left;
        margin-bottom: 15px;
        background: #f8fdff;
        border-radius: 4px;
        padding: 5px 10px;
    }

    .info
    {
        font-size: 12px;
        color: gray;
    }
</style>
