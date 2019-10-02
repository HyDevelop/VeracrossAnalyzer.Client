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
                <div class="course-grade">
                    <span class="letter">{{course.letterGrade}} </span>
                    <span class="numeric">{{course.numericGrade.toFixed(2)}} </span>
                    <span class="percent">%</span>
                </div>
                <!--div class="course-updates">
                    <span class="notifications">

                    </span>
                    <span class="">

                    </span>
                </div-->
            </div>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
