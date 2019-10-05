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

<script src="./overall.ts" lang="ts"></script>
<style src="./overall.scss" lang="scss"></style>
