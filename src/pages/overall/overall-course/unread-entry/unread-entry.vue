<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="3" class="date">
                {{formatDate(new Date(assignment.date))}}
            </el-col>
            <el-col :span="15" class="description">
                {{assignment.type}}
                {{assignment.description}}
            </el-col>
            <el-col :span="6" class="grade">
                {{assignment.score + '|' + assignment.scoreMax}}
            </el-col>
        </el-row>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
