<template>
    <div id="welcome">
        <div class="header">Welcome</div>
        <el-divider class="divider"><i class="el-icon-cold-drink"></i></el-divider>

        <div class="content" v-if="app.user.gradeLevel < 12">
            This new page is designed to help you with your course selection for your
            <span style="color:#409EFF">{{nextYearGradeLevel}} year</span>,
            providing more information such as how many people are currently enrolled in a course.
        </div>
        <div class="content" style="color: #ff3d3d" v-if="app.user.gradeLevel >= 12">
            You are a senior, what are you doing over here lol. <br>
            Unfortunately I can't help you with college course selection.
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
        
        get nextYearGradeLevel()
        {
            return GPAUtils.gradeLevelName(this.app.user.gradeLevel + 1)
        }
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>

</style>
