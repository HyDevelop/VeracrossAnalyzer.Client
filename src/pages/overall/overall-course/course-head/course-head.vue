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
        <el-dialog id="rating-popup" :visible.sync="ratingDialog" width="50%" top="5vh"
                   :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

            <span slot="title" class="header">
                <div class="title">Give a Rating for {{course.name}}</div>
                <span class="subtitle">And for {{course.teacherName}}<br></span>
                <span class="subtitle" style="color: #e67b0d;">(might need to scroll down to find the submit button)</span>
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
                <el-button @click="ratingDialog = false" :disabled="ratingPosting">Cancel</el-button>
                <el-button type="primary" @click="submitRating()" :disabled="canSubmit">
                    {{course.rated ? 'Update' : 'Submit'}}
                </el-button>
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
    import {RATING_CRITERIA} from '@/logic/course-info';
    import Navigation from '@/components/navigation/navigation';

    @Component
    export default class CourseHead extends Vue
    {
        @Prop({required: true}) unread: number;
        @Prop({required: true}) course: Course;
        @Prop({required: true}) clickable: boolean;

        ratingDialog = false;
        ratingPosting = false;
        rating = this.course.rating;

        get canSubmit()
        {
            return this.ratingPosting || App.instance.demoMode
        }

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
            return this.clickable && App.instance.showRating;
        }

        get ratingCriteria() {return RATING_CRITERIA}

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
            if (this.rating.ratings.includes(0))
            {
                this.$message.error('You haven\'t rated all of the criteria yet!');
                return;
            }

            this.ratingPosting = true;

            App.http.post('/course-info/rating/set', {rating: this.rating}).then(response =>
            {
                if (response.success)
                {
                    this.ratingDialog = false;
                    this.ratingPosting = false;
                    this.$message.success('Rating successfully posted, thank you!');

                    // First rating (Updating the first review doesn't count as first review)
                    if (this.course.rated) return;
                    this.course.rated = true;
                    if (App.instance.courses.filter(c => c.rated).length == 1)
                    {
                        this.$alert('You can view other courses\'' +
                            ' ratings in the Course Selection tab, or review yours by clicking' +
                            ' the green button that says "Rating Entered." There are also option to turn off the rating buttons ' +
                            ' by clicking on your avatar on the top right corner.',
                            'Thank you for submitting your fist rating!', {confirmButtonText: 'OK'}
                        );
                    }

                    // Last rating
                    if (App.instance.courses.filter(c => c.isGraded && !c.rated).length == 0)
                    {
                        this.$confirm('You have rated all of your courses! Do you want to turn off the rating buttons?' +
                            ' (there are option to toggle them on again by clicking your avatar on the top right corner.)',
                            'Thank you for submitting rating!',
                            {confirmButtonText: 'Sure!', cancelButtonText: 'Nope.'}).then(() =>
                        {
                            // Disable rating buttons
                            Navigation.instance.onAvatarMenu('switch-rating');
                            this.$message.success('Rating buttons are disabled');
                        });
                    }
                }
                else
                {
                    this.$message.error('Sorry, but rating failed to post, please try again or email me if you continues to have issues. ' +
                            'But wait! The email system isn\'t created yet... oops!. (Technical error message: ' + response.data + ')');
                    this.ratingPosting = false;
                }
            });
        }
    }
</script>

<style src="./course-head.scss" lang="scss" scoped/>
