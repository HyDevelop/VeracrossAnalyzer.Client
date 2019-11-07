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

            <AssignmentTypeHead v-for="type in getAssignmentTypes()" :key="type"
                                :type-name="type" :assignments="course.assignments">
            </AssignmentTypeHead>
        </div>
    </el-card>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Assignment} from '@/components/app/app';
    import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';
    import CourseScatter from '@/pages/course/course-scatter/course-scatter';
    import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
    import AssignmentTypeHead from '@/pages/course/assignment-type-head/assignment-type-head.vue';
    import Course from '@/logic/course';

    @Component({
        components: {AssignmentEntry, CourseHead, CourseScatter, AssignmentTypeHead}
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

        /**
         * Get all the types of the assignments.
         */
        getAssignmentTypes(): string[]
        {
            // Get all types
            let types = this.course.assignments.map(a => a.type);

            // Remove duplicates
            types = types.filter((type, i, a) => a.indexOf(type) == i);

            // Return it
            return types;
        }
    }
</script>

<style src="./course-page.scss" lang="scss" scoped></style>
