<template>
    <div class="unread-entry vertical-center">
        <el-row class="unread-row">
            <el-col :span="3" class="date">
                <span class="month">{{getMoment(assignment.date).format("MMM Do")}}</span>
                <span class="now">({{getMoment(assignment.date).fromNow()}})</span>
            </el-col>
            <el-col :span="15" class="description">
                <span class="type entry-box"
                      :style="`border-color: var(--assignment-type-${assignment.typeId})`">
                    {{assignment.type}}
                </span>
                <span class="text">{{assignment.description}}</span>
            </el-col>
            <el-col :span="6" class="grade">
                <span class="percent entry-box">
                    {{(assignment.score / assignment.scoreMax * 100).toFixed(1)}}
                    <span class="symbol">%</span>
                </span>
                <span class="score entry-box">{{assignment.score}}</span>
                <span class="max entry-box">{{assignment.scoreMax}}</span>
                <el-button class="mark-as-read" size="mini" type="text"
                           icon="el-icon-close" @click="markAsRead">
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./assignment-entry.ts" lang="ts"></script>
<style src="./assignment-entry.scss" lang="scss" scoped></style>
