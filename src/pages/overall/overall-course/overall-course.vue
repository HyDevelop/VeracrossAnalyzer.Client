<template>
    <div id="overall-course">
        <el-card class="course-card">
            <el-row>
                <el-col :span="6" class="course-col-name">
                    <div class="course-name">
                        {{course.name}}
                    </div>
                    <div class="course-teacher">
                        {{course.teacherName}}
                    </div>
                </el-col>
                <el-col :span="12">
                    &nbsp;
                </el-col>
                <el-col :span="6" class="course-col-grade">
                    <div class="course-grade">
                        <span class="letter">{{course.letterGrade}} </span>
                        <span class="numeric">{{course.numericGrade.toFixed(2)}} </span>
                        <span class="percent">%</span>
                    </div>
                    <div class="course-updates" :class="countUnread() === 0 ? 'none' : 'unread'">
                        <span class="unread-number">
                            {{countUnread()}}
                        </span>
                        <span class="unread-text">
                            new update{{countUnread() >= 2 ? 's' : ''}}
                        </span>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
