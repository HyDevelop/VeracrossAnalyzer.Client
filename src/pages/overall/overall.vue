<template>
    <div id="overall">
        <el-row>
            <el-col :span="4">
                <el-card class="gpa-card">
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
                <el-card class="overall-line-card">
                    <overall-line :courses="courses"></overall-line>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="overall-bar-card">
                    <overall-bar :courses="courses"></overall-bar>
                </el-card>
            </el-col>
        </el-row>

        <overall-course v-for="course in courses" :course="course"></overall-course>
    </div>
</template>

<script src="./overall.ts" lang="ts"></script>
<style src="./overall.scss" lang="scss"></style>
