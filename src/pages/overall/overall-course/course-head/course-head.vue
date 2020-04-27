<template>
    <div id="course-head" class="course-card-content main vertical-center">

        <!-- Rating button -->
        <div id="block-rate" v-if="displayRate" class="vertical-center clickable"
             @click="ratingDialog = true" :class="{rated: course.rated}">
            <span v-if="!course.rated">Give a<br>Rating!</span>
            <span v-else>Rating<br>Entered</span>
        </div>

        <!-- Main content -->
        <div id="content" @click="redirect" :class="clickable ? 'clickable' : ''">

            <!-- Left -->
            <div id="block-info">
                <div id="name">{{course.name}}</div>
                <div id="teacher">{{course.teacherName}}</div>
            </div>

            <!-- Right -->
            <div id="block-grade">
                <div id="grade">
                    <span id="letter">{{course.letterGrade}} </span>
                    <span id="numeric">{{course.numericGrade === undefined ? '--' : course.numericGrade.toFixed(2)}}</span>
                    <span id="percent" v-if="course.numericGrade !== undefined">%</span>
                </div>
                <div id="updates" @click="redirect" :class="unread === 0 ? 'none' : 'unread'">
                    <span id="unread-number">{{unread}}</span>
                    <span id="unread-text" :class="clickable ? 'clickable' : ''">new update{{unread >= 2 ? 's' : ''}}</span>
                </div>
            </div>

            <div id="block-term-grades" v-if="course.rawSelectedTerm === -1"
                 v-for="term in course.allGradingPeriods.slice().reverse()">
                <div id="term">Term {{term + 1}}</div>
                <div id="term-letter">{{course.letterGradeTerm(term)}}</div>
                <div id="term-numeric">{{course.numericGradeTerm(term).toFixed(1)}}%</div>
            </div>
        </div>

        <!-- Rating Popup -->
        <el-dialog id="rating-popup" :visible.sync="ratingDialog" width="50%" top="10vh"
                   :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

            <span slot="title" class="header">
                <div class="title">Give a Rating for {{course.name}}</div>
                <span class="subtitle">And for {{course.teacherName}}</span>
            </span>

            <div class="item" v-for="(criteria, index) of ratingCriteria">
                <div class="title">{{criteria.title}}</div>
                <div class="description">{{criteria.desc}}</div>

                <div class="stars">
                    <span class="star clickable" v-for="star in [0,1,2,3,4]" @click="changeStars(index, star)">
                        <i v-if="rating.ratings[index] > star" class="el-icon-star-on"/>
                        <i v-else class="el-icon-star-off"/>
                    </span>
                </div>
            </div>

            <div class="item">
                <div class="title">Comments</div>
                <div class="description">Any additional comments? (this is optional)</div>

                <el-input type="textarea" placeholder="Comments... (Optional)"
                           v-model="rating.comment" maxlength="4500" show-word-limit :autosize="{minRows: 2, maxRows: 4}">
                </el-input>
                <el-checkbox v-model="rating.anonymous">Anonymous</el-checkbox>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="ratingDialog = false">Cancel</el-button>
                <el-button type="primary" @click="submitRating()">{{course.rated ? 'Update' : 'Submit'}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Course from '@/logic/course';
    import App from '@/components/app/app';
    import {GPAUtils} from '@/logic/utils/gpa-utils';
    import Constants from '@/constants';

    @Component
    export default class CourseHead extends Vue
    {
        @Prop({required: true}) unread: number;
        @Prop({required: true}) course: Course;
        @Prop({required: true}) clickable: boolean;

        ratingDialog = false;
        ratingPosting = false;
        ratingCriteria = [
            {title: 'Enjoyable', desc: 'How enjoyable is the course?'},
            {title: 'Knowledge', desc: 'How interesting is the content of the course? ' +
                    'Is it something you feel worth learning?'},
            {title: 'Interactivity', desc: 'How interesting is the teacher? Is the teacher interactive?'},
            {title: 'Eloquence', desc: `Are the teacher's lectures easy to understand?`},
            {title: 'Fairness', desc: `How fair is the teacher's grading? Is credit given in proportion to effort?`}
        ];
        rating = this.course.rating;

        /**
         * Redirect to the course page
         */
        redirect()
        {
            if (!this.clickable) return;
            App.instance.nav.updateIndex(this.course.urlIndex);
        }

        /**
         * Display rate button or not
         */
        get displayRate()
        {
            return this.clickable && Constants.CURRENT_TERM == 3;
        }

        /**
         * Change star rating data
         *
         * @param index Index of the rating
         * @param star Change to how many stars
         */
        changeStars(index: number, star: number)
        {
            this.rating.ratings[index] = star + 1;
            this.$forceUpdate();
        }

        /**
         * Submit a rating
         */
        submitRating()
        {
            this.ratingPosting = true;

            App.http.post('/course-info/rating/set', {rating: this.rating}).then(response =>
            {
                if (response.success)
                {
                    this.course.rated = true;
                    this.ratingDialog = false;
                    this.$message.success('Rating successfully posted, thank you!');
                }
                else
                {
                    this.$message.error('Sorry, but rating failed to post, please try again or email me if you continues to have issues. ' +
                            'But wait! The email system isn\'t created yet... oops!. (Technical error message: ' + response.data + ')');
                }
            });
        }
    }
</script>

<style src="./course-head.scss" lang="scss" scoped/>
