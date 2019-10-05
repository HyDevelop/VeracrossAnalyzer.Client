<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="6">
                {{assignment.date}}
            </el-col>
            <el-col :span="6">
                {{assignment.type}}
            </el-col>
            <el-col :span="6">
                {{assignment.description}}
            </el-col>
            <el-col :span="6">
                {{assignment.score + '|' + assignment.scoreMax}}
            </el-col>
        </el-row>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
