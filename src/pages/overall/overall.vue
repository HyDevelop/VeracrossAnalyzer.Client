<template>
    <div id="overall">
        <el-progress v-if="progress !== 0" :text-inside="true" :percentage="progress"/>

        <el-dialog title="Notice" :visible.sync="clearUnreadPrompt"
                   width="30%" style="word-break: unset;">
            <span>You have too many new grade notifications. Clear them now?</span>
            <img src="./too-many-unread.png" alt=""/>
            <el-checkbox class="dialog-checkbox" v-model="dontAskAgain">Don't Ask Again</el-checkbox>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clearUnread(false)">Nah</el-button>
                <el-button type="primary" @click="clearUnread(true)">Sure!</el-button>
            </span>
        </el-dialog>

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
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import OverallLine from '@/pages/overall/overall-line/overall-line';
    import OverallBar from '@/pages/overall/overall-bar/overall-bar';
    import OverallCourse from '@/pages/overall/overall-course/overall-course';
    import Course, {Assignment} from '@/logic/course';
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
        getGPA()
        {
            return GPAUtils.getGPA(this.courses);
        }

        // For clear unread prompt
        unread: Assignment[];
        clearUnreadPrompt = false;
        dontAskAgain = false;
        progress = 0;

        /**
         * On page load - check if the user has too many notifications
         */
        mounted()
        {
            // Check unread
            if (!this.$cookies.isKey('va.ignore-unread'))
            {
                // Count unread
                this.unread = this.courses.flatMap(c => c.assignments.filter(a => a.unread));

                // Prompt clear
                if (this.unread.length > 15)
                {
                    this.clearUnreadPrompt = true;
                }
            }
        }

        /**
         * Clear unread
         *
         * @param confirmed
         */
        clearUnread(confirmed: boolean)
        {
            // Hide prompt
            this.clearUnreadPrompt = false;

            // Not confirmed, do nothing
            if (!confirmed)
            {
                if (!this.dontAskAgain) return;

                // Don't ask again
                this.$cookies.set('va.ignore-unread', true);
            }
        }
    }
</script>

<style src="./overall.scss" lang="scss" scoped/>
