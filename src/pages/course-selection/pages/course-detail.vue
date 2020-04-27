<template>
    <div id="course-detail">
        <div class="header">Course: <span style="color: #229fff">{{uniqueCourse.name}}</span></div>
        <el-divider class="divider"><i class="el-icon-reading"></i></el-divider>

        <div class="item" v-for="course in sortedCourses">
            <div>{{course.levelFull}} - <i>{{course.teacher}}</i></div>
            <div class="info">
                <span class="name">{{course.name}} : </span>
                <span class="classes"><i class="el-icon-s-home"/> {{course.classes.length}}</span>
                <span class="enrollments"><i class="el-icon-user"/> {{course.enrollments}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo, {AnalyzedRating, CourseInfoRating, UniqueCourse} from '@/logic/course-info';
    import App from '@/components/app/app';
    import course from '@/logic/course';

    @Component
    export default class CourseDetail extends Vue
    {
        @Prop({required: true}) uniqueCourse: UniqueCourse;

        created()
        {
            // Load ratings
            this.sortedCourses.forEach(c =>
            {
                // Already has rating
                if (c.rating as any != null) return;

                // Get rating
                App.http.post('/course-info/rating/get', {condition: 'course', value: c.id_ci}).then(result =>
                {
                    if (result.success)
                    {
                        // Assign rating
                        c.rating = result.data as AnalyzedRating;
                    }
                    else
                    {
                        this.$message.error(`Rating data for ${c.name} / ${c.teacher} failed to load.`)
                        console.log(result.data);
                    }
                })
            })
        }

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

        .classes
        {
            display: inline-block;
            margin-right: 10px;
        }
    }
</style>
