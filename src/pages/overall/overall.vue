<template>
    <div id="overall">
        <el-row>
            <el-col :span="4">
                <el-card class="large gpa-card vertical-center">
                    <div style="padding: 14px;">
                        <span class="gpa header">GPA:</span>
                        <span class="gpa text">{{getGPA().gpa}}</span>
                        <span class="gpa max">(Out of {{getGPA().max}})</span>
                        <div class="bottom clearfix gpa time">
                            <time>{{ new Date().toDateString() }}</time>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14">
                <el-card class="large overall-line-card vertical-center">
                    <overall-line :courses="courses"></overall-line>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="large overall-bar-card vertical-center">
                    <overall-bar :courses="courses"></overall-bar>
                </el-card>
            </el-col>
        </el-row>

        <overall-course v-for="course in courses"
                        :course="course"
                        :key="course.id">
        </overall-course>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import OverallLine from '@/pages/overall/overall-line/overall-line';
    import OverallBar from '@/pages/overall/overall-bar/overall-bar';
    import OverallCourse from '@/pages/overall/overall-course/overall-course';
    import Course from '@/logic/course';
    import {GPAUtils} from '@/utils/gpa-utils';

    @Component({
        components: {OverallLine, OverallBar, OverallCourse}
    })
    export default class Overall extends Vue
    {
        @Prop({required: true}) courses: Course[];

        /**
         * This function is called to get gpa since I can't import another
         * class in the Vue file.
         */
        public getGPA()
        {
            return GPAUtils.getGPA(this.courses);
        }
    }
</script>

<style src="./overall.scss" lang="scss" scoped></style>
