<template>
    <el-card id="course-card" class="course-card">
        <course-head :course="course" :unread="countUnread()"></course-head>

        <div class="course-card-content expand notification">

        </div>
    </el-card>
</template>

<script src="./course-page.ts" lang="ts"></script>
<style src="./course-page.scss" lang="scss"></style>
