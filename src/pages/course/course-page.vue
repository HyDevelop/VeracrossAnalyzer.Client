<template>
    <el-card id="course-card" class="course-card">
        <course-head :clickable="false" :course="course" :unread="countUnread()"></course-head>

        <div class="course-card-content expand">
            <el-row>
                <el-col :span="24">
                    <el-card class="large overall-line-card vertical-center">
                        <course-scatter :course="course"></course-scatter>
                    </el-card>
                </el-col>
                <el-col :span="0">

                </el-col>
            </el-row>


            <el-row>
                <el-col :span="12">
                    <el-card class="large overall-line-card vertical-center" body-style="padding: 0">
                        <TypeRadar :course="course"></TypeRadar>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="large overall-line-card vertical-center" body-style="padding: 0">
                        <TypePie :course="course"></TypePie>
                    </el-card>
                </el-col>
            </el-row>

            <AssignmentTypeHead v-for="type in course.assignmentTypes" :key="type.id"
                                :type="type" :assignments="course.assignments">
            </AssignmentTypeHead>
        </div>
    </el-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';
    import CourseScatter from '@/pages/course/course-scatter/course-scatter';
    import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
    import AssignmentTypeHead from '@/pages/course/assignment-type-head/assignment-type-head.vue';
    import Course, {Assignment} from '@/logic/course';
    import TypeRadar from '@/pages/course/type-radar/type-radar';
    import TypePie from '@/pages/course/type-pie/type-pie';

    @Component({
        components: {TypeRadar, TypePie, AssignmentEntry, CourseHead, CourseScatter, AssignmentTypeHead}
    })
    export default class CoursePage extends Vue
    {
        @Prop({required: true}) course: Course;

        private unread: number = -1;
        private unreadAssignments: Assignment[] = [];

        /**
         * Count the number of unread assignments with cache
         */
        countUnread(): number
        {
            if (this.unread == -1)
            {
                this.unreadAssignments = this.course.assignments.filter(a => a.unread);
                return this.unread = this.unreadAssignments.length;
            }
            else return this.unread;
        }
    }
</script>

<style src="./course-page.scss" lang="scss" scoped></style>
