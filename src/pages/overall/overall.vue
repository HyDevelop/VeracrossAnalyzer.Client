<template>
    <div id="overall">
        <el-row v-if="getGPA().gpa !== -1">
            <el-col :span="4" class="overall-span">
                <el-card class="large gpa-card vertical-center" body-style="padding: 0">
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
            <el-col :span="14" class="overall-span">
                <el-card class="large overall-line-card vertical-center" body-style="padding: 0 10px">
                    <overall-line :courses="courses"/>
                </el-card>
            </el-col>
            <el-col :span="6" class="overall-span">
                <el-card class="large overall-bar-card vertical-center" body-style="padding: 0 10px">
                    <overall-bar :courses="courses"/>
                </el-card>
            </el-col>
        </el-row>

        <el-row v-if="getGPA().gpa === -1">
            <el-card class="large gpa-card vertical-center">
                <div class="no-grade">This quarter has no grades yet...</div>
            </el-card>
        </el-row>

        <overall-course v-for="course in courses"
                        :course="course"
                        :key="course.id">
        </overall-course>

        <el-dialog
                title="Notice"
                :visible.sync="promptClearNotification"
                width="30%"
                :before-close="handleClose">
            <span>You have too many new grade notifications. Clear them now?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="promptClearNotification = false">Nah</el-button>
                <el-button type="primary" @click="promptClearNotification = false">Sure!</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import OverallLine from '@/pages/overall/overall-line/overall-line';
    import OverallBar from '@/pages/overall/overall-bar/overall-bar';
    import OverallCourse from '@/pages/overall/overall-course/overall-course';
    import Course from '@/logic/course';
    import {GPAUtils} from '@/logic/utils/gpa-utils';

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

<style src="./overall.scss" lang="scss" scoped/>
