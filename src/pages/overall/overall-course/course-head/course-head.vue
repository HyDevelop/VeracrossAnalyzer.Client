<template>
    <div id="course-head" class="course-card-content main vertical-center">
        <el-row>
            <el-col :span="6" class="course-col-name">
                <div class="course-name">{{course.name}}</div>
                <div class="course-teacher">{{course.teacherName}}</div>
            </el-col>
            <el-col :span="12">
                &nbsp;
            </el-col>
            <el-col :span="6" class="course-col-grade">
                <div class="course-grade">
                    <span class="letter">{{course.letterGrade}} </span>
                    <span class="numeric">{{course.numericGrade.toFixed(2)}}</span>
                    <span class="percent">%</span>
                </div>
                <div class="course-updates" :class="unread === 0 ? 'none' : 'unread'">
                    <span class="unread-number">{{unread}}</span>
                    <span class="unread-text">new update{{unread >= 2 ? 's' : ''}}</span>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Course} from "@/components/app/app";

    @Component({
        components: {}
    })
    export default class CourseHead extends Vue
    {
        // @ts-ignore
        @Prop() unread: number;

        // @ts-ignore
        @Prop() course: Course;
    }
</script>
