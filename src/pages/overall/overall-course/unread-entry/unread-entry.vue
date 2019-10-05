<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="3" class="date">
                {{formatDate(new Date(assignment.date))}}
            </el-col>
            <el-col :span="15" class="description">
                <span class="type">{{assignment.type}}</span>
                <span class="text">{{assignment.description}}</span>
            </el-col>
            <el-col :span="6" class="grade">
                <span class="score">{{assignment.score}}</span>
                <span class="max">{{assignment.scoreMax}}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
