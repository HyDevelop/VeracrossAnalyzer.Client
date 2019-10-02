<template>
    <div id="overall-course">
        <el-card class="course-card">
            <el-row>
                <el-col :span="6" class="course-col-name">
                    <div class="course-name">
                        <span>{{course.name}}</span>
                    </div>
                    <div class="course-teacher">
                        {{course.teacherName}}
                    </div>
                </el-col>
                <el-col :span="12">

                </el-col>
                <el-col :span="6">

                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
