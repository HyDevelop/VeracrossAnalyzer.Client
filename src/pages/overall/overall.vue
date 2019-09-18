<template>
    <div id="overall">
        <el-row>
            <el-col :span="4">
                <el-card style="margin-left: 20px">
                    <div style="padding: 14px;">
                        <span class="span-gpa-header">GPA:</span>
                        <br>
                        <span class="span-gpa">{{getGPA()}}</span>
                        <div class="bottom clearfix gpa-time">
                            <time class="time">{{ new Date().toDateString() }}</time>
                            <br>
                            <el-button type="text" class="button">Button</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="20">
                <el-card style="margin-right: 20px">
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
