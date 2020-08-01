<template>
    <div id="welcome">
        <div class="header">Welcome</div>
        <el-divider class="divider"><i class="el-icon-cold-drink"></i></el-divider>

        <div class="content" style="color: #ff3d3d" v-if="app.user.gradeLevel >= 12">
            You are a senior, what are you doing over here lol. <br>
            Unfortunately I can't help you with college course selection.<br>
            (But you can still view course ratings)<br><br>
        </div>

        <div class="content">
            <span style="color:#409EFF">
                This new page is designed to help you with your course selection for your {{nextGrade}} year,
                providing more information such as how many people are currently enrolled in a course.
            </span>
            <br><br>
            The courses displayed are from the current year,
            but since they are unlikely to change,
            they can provide a good view for the courses next year.
            However, this also means that the new courses
            and courses that didn't open this year are not going to be displayed here.
            For 2020, the new courses are Financial Algebra and Acc Psychology.
            Also, by default, only the courses that current {{nextGrade.toLowerCase()}}s take are displayed,
            and you can enable "show all courses" in settings if you want to see all courses.
            <br><br>
            <b>Notations:</b><br>
            <i class="el-icon-s-home"/>: How many classes (blocks) did the course open this year.<br>
            <i class="el-icon-user-solid"/>: How many teachers are teaching this course.<br>
            <i class="el-icon-user"/> How many students are enrolled.<br>
            <br>
            <b>Sorting:</b><br>
            By default the courses are sorted by name,
            but you can change the settings to sort by popularity, by classes, or by level.
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import App from '@/components/app/app';
    import {GPAUtils} from '@/logic/utils/gpa-utils';

    @Component
    export default class Welcome extends Vue
    {
        @Prop({required: true}) app: App

        get nextGrade()
        {
            return GPAUtils.gradeLevelName(this.app.user.gradeLevel + 1)
        }
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
    .content
    {
        text-align: justify;
        color: #585858;
    }
</style>
