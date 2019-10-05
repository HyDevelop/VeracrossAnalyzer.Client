<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="2" class="date">
                {{getMoment(assignment.date).format("MMM Do")}}
            </el-col>
            <el-col :span="16" class="description">
                <span class="type entry-box">{{assignment.type}}</span>
                <span class="text">{{assignment.description}}</span>
            </el-col>
            <el-col :span="6" class="grade">
                <span class="percent entry-box">
                    {{(assignment.score / assignment.scoreMax * 100).toFixed(1)}}
                    <span class="symbol">%</span>
                </span>
                <span class="score entry-box">{{assignment.score}}</span>
                <span class="max entry-box">{{assignment.scoreMax}}</span>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
