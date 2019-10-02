<template>
    <div id="overall-course">
        <el-card class="course-card">
            <div class="course-col-name">
                <div class="course-name">
                    {{course.name}}
                </div>
                <div class="course-teacher">
                    {{course.teacherName}}
                </div>
            </div>
            <div class="course-col-grade">
                <div class="course-letter-grade">
                    {{course.letterGrade}} {{course.numericGrade}}
                </div>
                <div class="course-numeric-grade">

                </div>
            </div>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
