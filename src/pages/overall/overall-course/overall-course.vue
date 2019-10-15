<template>
    <div id="overall-course">
        <el-card class="course-card">
            <div class="course-card-content expand notification"
                 v-if="countUnread() !== 0">
                <unread-entry v-for="assignment in unreadAssignments"
                              :assignment="assignment"
                              :key="assignment.id"
                              v-on:mark-as-read="markAsRead">
                </unread-entry>
            </div>
        </el-card>
    </div>
</template>

<script src="./overall-course.ts" lang="ts"></script>
<style src="./overall-course.scss" lang="scss"></style>
