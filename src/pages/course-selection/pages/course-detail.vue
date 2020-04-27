<template>
    <div id="course-detail">
        <div class="header">Course: <span style="color: #229fff">{{uniqueCourse.name}}</span></div>
        <el-divider class="divider"><i class="el-icon-reading"></i></el-divider>

        <!-- All course-infos -->
        <div class="item clickable unselectable" v-for="c in sortedCourses" @click="openDetails(c)">
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
                        <span class="info">
                            <span class="numeric-rating">{{c.rating.overallRating}} / 5</span>
                            <span>({{c.rating.totalCount}} rating{{c.rating.totalCount > 1?'s':''}})</span>
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <!-- Detail / Comments Popup -->
        <el-dialog id="detail-popup" v-if="detailsCourse" :visible.sync="detailsCourse" width="50%" top="10vh">
            <span slot="title" class="header">
                <div class="title">Ratings for {{detailsCourse.name}}</div>
                <span class="subtitle">And for {{detailsCourse.teacher}}</span>
            </span>

            <div class="rating-item" v-for="(criteria, index) of ratingCriteria">
                <div class="title float-left">{{criteria.title}}</div>

                <div class="stars float-right">
                    <StarRating :score="rating.ratingAverages[index]"></StarRating>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import CourseInfo, {AnalyzedRating, CourseInfoRating, RATING_CRITERIA, UniqueCourse} from '@/logic/course-info';
    import App from '@/components/app/app';
    import course from '@/logic/course';
    import LoadingSpinner from '@/components/loading-spinner.vue';
    import loading from '@/components/overlays/loading.vue';
    import StarRating from '@/components/star-rating.vue';
    @Component({components: {StarRating, LoadingSpinner}})
    export default class CourseDetail extends Vue
    {
        @Prop({required: true}) uniqueCourse: UniqueCourse;

        detailsCourse: CourseInfo = null as any as CourseInfo

        get ratingCriteria() {return RATING_CRITERIA}
        get rating() {return this.detailsCourse.rating}

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

        openDetails(course: CourseInfo)
        {
            this.detailsCourse = this.detailsCourse == course ? null as any as CourseInfo : course;
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

        .numeric-rating
        {
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

    .rating
    {
        .text
        {
            font-size: 14px;
        }
    }

    #detail-popup
    {
        text-align: left;

        .header
        {
            .title
            {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-bottom: -10px;
            }

            .subtitle
            {
                margin-left: 10px;
                font-size: 12px;
                font-style: italic;
                color: #999999;
            }
        }

        .rating-item
        {
            height: 30px;
        }

        .rating-item:first-child
        {
            margin-top: -15px;
        }
    }
</style>
