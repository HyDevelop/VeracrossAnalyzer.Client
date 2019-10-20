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
    import App, {Course} from '@/components/app/app';
    import {CourseUtils} from '@/utils/course-utils';

    @Component({
        components: {}
    })
    export default class CourseHead extends Vue
    {
        // @ts-ignore
        @Prop() unread: number;

        // @ts-ignore
        @Prop() course: Course;

        // @ts-ignore
        @Prop() clickable: boolean;

        /**
         * Redirect to the course page
         */
        redirect()
        {
            if (!this.clickable) return;
            App.instance.selectedTab = CourseUtils.formatTabIndex(this.course);
        }
    }
</script>

<style lang="scss">
    // Main card content
    .course-card-content.main
    {
        padding: 0 20px 0 20px;
        height: 90px;

        // Main color
        background: white;
    }

    .course-col-name
    {
        // Align left
        text-align: left;
        float: left;

        .course-name
        {
            overflow: hidden;
            font-size: 22px;
            color: var(--main);
        }

        .course-teacher
        {
            font-size: 12px;
            color: #999999;
            font-style: italic;
        }
    }

    .course-col-grade
    {
        // Align right
        text-align: right;
        float: right;

        // Adjust position
        margin-top: -2px;

        .course-grade
        {
            font-size: 21px;
        }

        .course-updates
        {
            font-size: 14px;

            .unread-number
            {
                display: inline-block;
                width: 20px;
                text-align: center;
                border-radius: 5px;

                padding-left: 3px;
                padding-right: 3px;

                margin-right: 3px;
            }

            .unread-text
            {
                font-style: italic;
            }
        }

        .course-updates.unread
        {
            .unread-number
            {
                background: var(--unread);
                color: white;
            }

            .unread-text
            {
                color: var(--unread);
            }
        }

        .course-updates.none
        {
            color: #999999;

            .unread-number
            {
                background: #eeeeee;
            }
        }
    }
</style>
