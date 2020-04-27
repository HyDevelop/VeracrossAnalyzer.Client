<template>
    <div id="course-detail">
        <div class="header">Course: <span style="color: #229fff">{{uniqueCourse.name}}</span></div>
        <el-divider class="divider"><i class="el-icon-reading"></i></el-divider>

        <div class="item" v-for="c in sortedCourses">
            <div class="float-left">
                <div>{{c.levelFull}} - <i>{{c.teacher}}</i></div>
                <div class="info">
                    <span class="name">{{c.name}} : </span>
                    <span class="classes"><i class="el-icon-s-home"/> {{c.classes.length}}</span>
                    <span class="enrollments"><i class="el-icon-user"/> {{c.enrollments}}</span>
                </div>
            </div>

            <div class="float-right">
                <LoadingSpinner v-if="c.rating == null" class="loading" size="30" :centered="false"/>
                <div v-else class="rating">
                    <span v-if="c.rating.totalCount === 0" class="text">No ratings yet...</span>
                    <span v-else class="stars">
                        <StarRating :score="c.rating.overallRating"></StarRating>
                        <span class="info">{{c.rating.overallRating}}/5</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo, {AnalyzedRating, CourseInfoRating, UniqueCourse} from '@/logic/course-info';
    import App from '@/components/app/app';
    import course from '@/logic/course';
    import LoadingSpinner from '@/components/loading-spinner.vue';
    import loading from '@/components/overlays/loading.vue';
    import StarRating from '@/components/star-rating.vue';
    @Component({components: {StarRating, LoadingSpinner}})
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
                        c.rating = new AnalyzedRating(result.data);
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

        height: 40px;
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

    .float-left
    {
        text-align: left;
        float: left;
    }

    .float-right
    {
        text-align: right;
        float: right;
    }

    .loading
    {
        margin-top: 5px !important;
    }

</style>
