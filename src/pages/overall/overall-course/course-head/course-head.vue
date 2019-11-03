<template>
    <div id="course-head" class="course-card-content main vertical-center">
        <el-row>
            <el-col :span="12" class="course-col-name">
                <div v-if="clickable" class="course-name clickable" @click="redirect">{{course.name}}</div>
                <div v-if="!clickable" class="course-name">{{course.name}}</div>
                <div class="course-teacher">{{course.teacherName}}</div>
            </el-col>
            <el-col :span="12" class="course-col-grade">
                <div class="course-grade">
                    <span class="letter">{{course.letterGrade}} </span>
                    <span class="numeric">{{course.numericGrade.toFixed(2)}}</span>
                    <span class="percent">%</span>
                </div>
                <div class="course-updates" @click="redirect" :class="unread === 0 ? 'none' : 'unread'">
                    <span class="unread-number">{{unread}}</span>
                    <span class="unread-text" :class="clickable ? 'clickable' : ''">
                        new update{{unread >= 2 ? 's' : ''}}
                    </span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Course} from '@/components/app/app';
    import {CourseUtils} from '@/utils/course-utils';
    import Navigation from '@/components/navigation/navigation';

    @Component({
        components: {}
    })
    export default class CourseHead extends Vue
    {
        @Prop({required: true}) unread: number;

        @Prop({required: true}) course: Course;

        @Prop({required: true}) clickable: boolean;

        /**
         * Redirect to the course page
         */
        redirect()
        {
            if (!this.clickable) return;
            Navigation.instance.updateIndex(CourseUtils.formatTabIndex(this.course));
        }
    }
</script>

<style src="./course-head.scss" lang="scss"></style>
