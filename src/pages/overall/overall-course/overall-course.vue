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
                <el-col :span="6" style="width: auto">
                    <div class="course-letter-grade">
                        {{course.letterGrade}}
                    </div>
                    <div class="course-numeric-grade">
                        {{course.numericGrade}}
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
