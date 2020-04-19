<template>
    <div id="course-selection">
        <el-card id="info">
            <div class="header">Course Selection</div>
            <div class="content" v-if="app.user.gradeLevel < 12">
                This new page is designed to help you with your course selection for your
                <span style="color:#409EFF">{{nextYearGradeLevel}} year</span>,
                providing more information such as how many people are currently enrolled in a course.
            </div>
            <div class="content" style="color: #ff3d3d" v-if="app.user.gradeLevel >= 12">
                You are a senior, what are you doing over here lol. <br>
                Unfortunately I can't help you with college course selection.
            </div>
        </el-card>

        <el-row>
            <el-col :span="16" class="overall-span">
                <el-card class="left vertical-center" :style="{height: cardsHeight + 'px'}">

                </el-card>
            </el-col>

            <!-- Course list card -->
            <el-col :span="8" class="overall-span">
                <el-card id="course-list" class="right" ref="cl" body-style="padding: 0" :style="{height: cardsHeight + 'px'}">
                    <div class="header padding-fix">
                        <div class="text">Course List</div>

                        <!-- Search -->
                        <el-input class="search" placeholder="Search..." prefix-icon="el-icon-search" v-model="search"></el-input>
                    </div>

                    <!-- Actual course list -->
                    <div class="list padding-fix" :style="{height: courseListHeight + 'px'}">
                        <!-- Every course -->
                        <div v-for="(course, index) in uniqueCourses" class="item vertical-center">
                            <div class="name">{{course.name}}</div>
                            <div class="descriptions">
                                <span class="classes"><i class="el-icon-s-home"/>{{course.courses.length}}</span>
                                <span class="enrollments"><i class="el-icon-user-solid"/>{{course.enrollments}}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'
    import App from '@/components/app/app';
    import CourseInfo, {UniqueCourse} from '@/logic/course-info';
    import {GPAUtils} from '@/logic/utils/gpa-utils';

    @Component
    export default class CourseSelection extends Vue
    {
        @Prop({required: true}) app: App

        search: string = '';
        courseInfo: CourseInfo[] = []
        courseIdIndex: any = {} // Map<CourseID, index in courseInfo>
        directory: {gradeLevel: number, classes: string}[] = []
        loading = true

        courseListHeight: number = 0;
        cardsHeight: number = 0;

        /**
         * Called before rendering
         */
        created()
        {
            // Update width dynamically
            window.addEventListener('resize', this.updateHeight);

            // Get courses
            App.http.post('/course-info', {}).then(result =>
            {
                if (result.success)
                {
                    // Parse data
                    this.courseInfo = result.data.courseInfos.map((json: any, index: number) =>
                    {
                        let info = new CourseInfo(json);

                        // Index
                        info.courseIds.forEach(id => this.courseIdIndex[id] = index);
                        return info;
                    });
                    this.directory = result.data.studentInfos;

                    // Use directory data
                    this.directory.forEach(d =>
                    {
                        d.classes.split('|').forEach(classId =>
                        {
                            // Get info by class id
                            let info = this.courseInfo[this.courseIdIndex[+classId]];
                            if (info as any != null)
                            {
                                // Add grade level
                                if (!info.gradeLevels.includes(d.gradeLevel))
                                {
                                    info.gradeLevels.push(d.gradeLevel);
                                }

                                // Count enrollments
                                info.enrollments ++;
                            }
                        })
                    })

                    this.courseInfo.sort((one, two) => one.name.localeCompare(two.name))
                }
            });
        }

        /**
         * Called on destroy
         */
        destroyed()
        {
            // Remove width updater
            window.removeEventListener('resize', this.updateHeight);
        }

        /**
         * Called on vue update
         */
        updated()
        {
            this.updateHeight()
        }

        /**
         * Update header height. (CSS doesn't work)
         */
        updateHeight()
        {
            // Get element
            let cl = this.$refs.cl as Vue;
            if (cl as any == null) return;
            let el = cl.$el;

            // Calculate height
            this.cardsHeight = window.innerHeight - el.getBoundingClientRect().top - 20;
            this.courseListHeight = this.cardsHeight - 15 - 102;
        }


        get filteredCourses()
        {
            let year = GPAUtils.getSchoolYear();

            return this.courseInfo.filter(c =>
                c.uniqueName.toLowerCase().includes(this.search) &&
                c.level != null && c.level !== 'Club' && c.level !== 'Sport' && c.level !== 'None' &&
                c.year == year && c.gradeLevels.includes(this.app.user.gradeLevel + 1));
        }

        /**
         * Gets unique courses by name, even though many different teachers might teach it.
         */
        get uniqueCourses(): UniqueCourse[]
        {
            let names: string[] = [];
            let list: UniqueCourse[] = [];

            this.filteredCourses.forEach(c =>
            {
                // Create the course list if doesn't exist
                if (!names.includes(c.uniqueName))
                {
                    names.push(c.uniqueName);
                    list.push({name: c.uniqueName, courses: [], enrollments: 0})
                }

                // Add the course
                list[names.indexOf(c.uniqueName)].courses.push(c);
                list[names.indexOf(c.uniqueName)].enrollments += c.enrollments;
            })

            return list;
        }

        get nextYearGradeLevel()
        {
            return GPAUtils.gradeLevelName(this.app.user.gradeLevel + 1)
        }
    }
</script>

<style src="./course-selection.scss" lang="scss" scoped/>
