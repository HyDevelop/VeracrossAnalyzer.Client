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
            <el-col :span="10">
                <el-card>
                    <graph-overall :courses="courses"></graph-overall>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card style="margin-right: 20px">
                    <graph-average :courses="courses"></graph-average>
                </el-card>
            </el-col>
        </el-row>
        <div class=""></div>
    </div>
</template>

<script src="./overall.ts" lang="ts"></script>
<style src="./overall.scss" lang="scss"></style>
