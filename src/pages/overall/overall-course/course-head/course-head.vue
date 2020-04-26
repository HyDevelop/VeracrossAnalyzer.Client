<template>
    <div id="course-head" class="course-card-content main vertical-center"
         :class="clickable ? 'clickable' : ''" @click="redirect">

        <div id="block-info">
            <div id="name">{{course.name}}</div>
            <div id="teacher">{{course.teacherName}}</div>
        </div>

        <div id="block-rate" v-if="displayRate" class="vertical-center">
            Give a<br>rating!
        </div>

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
        <!-- Popup -->
        <el-dialog :title="`Give a Rating for ${course.name}`" :visible.sync="ratingDialog" :show-close="false"
                   width="50%">
            <span>This is a message</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ratingDialog = false">Cancel</el-button>
                <el-button type="primary" @click="ratingDialog = false">Confirm</el-button>
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
            return this.clickable && !this.course.rated && Constants.CURRENT_TERM == 3;
        }
    }
</script>

<style src="./course-head.scss" lang="scss" scoped/>
