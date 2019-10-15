<template>
    <el-card id="course-card" class="course-card">
        <course-head :course="course" :unread="countUnread()"></course-head>

        <div class="course-card-content expand notification">
            <el-row>
                <el-col :span="8" id="course-description">
                </el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script src="./course-page.ts" lang="ts"></script>
<style src="./course-page.scss" lang="scss"></style>
