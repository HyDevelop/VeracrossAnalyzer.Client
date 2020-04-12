<template>
    <div id="course-selection">
        <el-card id="info">
            <div class="header">Course Selection</div>
            <div class="content" v-if="app.user.gradeLevel < 12">
                This new page is designed to help you with your course selection next year,
                providing more information such as how many people are currently enrolled in a course.
            </div>
            <div class="content" style="color: #ff3d3d" v-if="app.user.gradeLevel >= 12">
                You are a senior, what are you doing over here lol. <br>
                Unfortunately I can't help you with college course selection.
            </div>
        </el-card>

        <el-row>
            <el-col :span="16" class="overall-span">
                <el-card class="large left vertical-center">

                </el-card>
            </el-col>

            <!-- Course list -->
            <el-col :span="8" class="overall-span">
                <el-card id="course-list" class="large right">
                    <div class="header">Course List</div>

                    <!-- Search -->
                    <el-input placeholder="Search..." prefix-icon="el-icon-search" v-model="search"></el-input>

                    <!-- Every course -->
                    <div v-for="(course, index) in courseInfo.filter(c => c.name.toLowerCase().includes(search))"
                         class="item vertical-center">
                        <span class="name">{{course.name}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import App from '@/components/app/app';
    import CourseInfo from '@/logic/course-info';

    @Component
    export default class CourseSelection extends Vue
    {
        @Prop({required: true}) app: App

        search: string = "";
        courseInfo: CourseInfo[] = []
        directory: any[] = []
        loading = true

        created()
        {
            // Get courses
            App.http.post('/course-info', {}).then(result =>
            {
                if (result.success)
                {
                    // Parse data
                    this.courseInfo = result.data.map((json: any) => new CourseInfo(json));
                }
            });

            // Get directory
            App.http.post('/directory', {}).then(result =>
            {
                if (result.success) this.directory = result.data;
            })
        }
    }
</script>

<style lang="scss" scoped>
    #info
    {
        margin: 20px 20px 10px;

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

    #course-list
    {
        margin-right: 20px;
        overflow-y: scroll;

        .header
        {
            margin-top: 15px;
            margin-bottom: 10px;

            font-size: 24px;
        }

        .item
        {
            height: 30px;
        }
    }

    // Cards
    .left
    {
        margin-left: 20px;
    }
</style>
