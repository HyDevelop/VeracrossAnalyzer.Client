<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="3" class="date">
                {{formatDate(new Date(assignment.date))}}
            </el-col>
            <el-col :span="15" class="description">
                <span>{{assignment.type}}</span>
                <span>{{assignment.description}}</span>
            </el-col>
            <el-col :span="6" class="grade">
                <span>{{assignment.score}}</span>
                <span>{{assignment.scoreMax}}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
