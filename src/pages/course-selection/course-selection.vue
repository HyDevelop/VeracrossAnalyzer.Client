<template>
    <div id="course-selection">
        <el-card id="info">
            <div class="header">Course Selection</div>
            <div class="content">
                This new page is designed to help you with your course selection next year,
                providing more information such as how many people are currently enrolled in a course.
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import App from '@/components/app/app';

    @Component
    export default class CourseSelection extends Vue
    {
        @Prop({required: true}) app: App;
    }
</script>

<style lang="scss" scoped>
#info
{
    margin: 20px;

    .header
    {
        margin-top: 15px;
        margin-bottom: 10px;

        font-size: 30px;
        color: #8c85ea;
    }

    .content
    {
        margin-bottom: 15px;
    }
}
</style>
