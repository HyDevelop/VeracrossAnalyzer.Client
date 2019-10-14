<template>
    <div id="course-page">
        <el-row>
            <el-col :span="8" id="course-description">
                <div class="name">{{course.name}}</div>
                <div class="teacher">{{course.teacherName}}</div>
                <div class="level">{{course.level}}</div>
                <div class="id">{{course.id}}</div>
            </el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
    </div>
</template>

<script src="./course-page.ts" lang="ts"></script>
<style src="./course-page.scss" lang="scss"></style>
