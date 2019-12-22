<template>
    <div id="overall-course">
        <el-card class="course-card">
            <course-head :clickable="true" :course="course" :unread="unread"/>
            <div class="course-card-content expand"
                 v-if="unread !== 0">
                <unread-entry v-for="assignment in unreadAssignments"
                              :assignment="assignment"
                              :key="assignment.id"
                              unread="true"
                </unread-entry>
                              v-on:mark-as-read="assignment.markAsRead()">
            </div>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss" scoped/>
