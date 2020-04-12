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
                <el-card id="course-list" ref="cl" class="large right" body-style="padding: 0">
                    <div class="header" :style="{width: courseListWidth + 'px'}">
                        <div class="text">Course List</div>

                        <!-- Search -->
                        <el-input class="search" placeholder="Search..." prefix-icon="el-icon-search" v-model="search"></el-input>
                    </div>

                    <!-- Every course -->
                    <div v-for="(course, index) in filteredCourses" class="item vertical-center">
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

        courseListWidth: number = 10;

        /**
         * Called before rendering
         */
        created()
        {
            // Update width dynamically
            window.addEventListener("resize", this.updateWidth);

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

        /**
         * Called on destroy
         */
        destroyed()
        {
            // Remove width updater
            window.removeEventListener("resize", this.updateWidth);
        }

        /**
         * Called on vue update
         */
        updated()
        {
            this.updateWidth()
        }

        /**
         * Update header width. (CSS doesn't work)
         * https://stackoverflow.com/questions/17011195/positionfixed-and-widthinherit-with-percentage-parent
         */
        updateWidth()
        {
            this.courseListWidth = (<Vue> this.$refs.cl).$el.clientWidth - 20;
        }

        get filteredCourses()
        {
            return this.courseInfo.filter(c => c.name.toLowerCase().includes(this.search))
                .filter(c => c.level !== 'Club');
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
            position: fixed;
            background: white;

            // Fix width issue
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 4px;

            .text
            {
                margin-top: 15px;
                margin-bottom: 10px;

                font-size: 24px;
            }

            .search
            {
                margin-bottom: 20px;
            }
        }

        .item
        {
            height: 30px;
            text-align: left;
            margin-bottom: 10px;

            background: #fbfbfb;
            border-radius: 4px;
            padding-left: 10px;
        }
    }

    // Cards
    .left
    {
        margin-left: 20px;
    }
</style>
