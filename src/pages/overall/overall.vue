<template>
    <div id="overall">
        <el-row>
            <el-col :span="4">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="padding: 14px;">
                        <span>GPA: {{getGPA()}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ new Date().toDateString() }}</time>
                            <el-button type="text" class="button">操作按钮</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="20">
                <el-card :body-style="{ padding: '0px' }">
                    <p>Your average score graph all time:</p>
                    <graph-overall :chart="convertCharts"></graph-overall>
                </el-card>
            </el-col>
        </el-row>
        <div class=""></div>
    </div>
</template>

<script src="./overall.ts" lang="ts"></script>
<style src="./overall.scss" lang="scss"></style>
