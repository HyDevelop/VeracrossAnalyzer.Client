<template>
    <el-card id="course-card" class="course-card">
        <course-head :course="course" :unread="countUnread()"></course-head>

        <div class="course-card-content expand">
            <el-row>
                <el-col :span="14">
                    <el-card class="large overall-line-card vertical-center">
                        <course-scatter :course="course"></course-scatter>
                    </el-card>
                </el-col>
                <el-col :span="10">

                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script src="./course-page.ts" lang="ts"></script>
<style src="./course-page.scss" lang="scss" scoped></style>
