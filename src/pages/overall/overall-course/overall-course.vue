<template>
    <div id="overall-course">
        <el-card class="course-card">
            <course-head :clickable="true" :course="course" :unread="unread()"/>
            <div class="course-card-content expand"
                 v-if="unread() !== 0">
                <assignment-entry v-for="assignment in unreadAssignments()"
                              :assignment="assignment"
                              :key="assignment.id"
                              unread="true"
                              v-on:mark-as-read="assignment.markAsRead()">
                </assignment-entry>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
    import CourseHead from '@/pages/overall/overall-course/course-head/course-head.vue';
    import Course, {Assignment} from '@/logic/course';

    @Component({
        components: {AssignmentEntry, CourseHead}
    })
    export default class OverallCourse extends Vue
    {
        @Prop({required: true}) course: Course;

        mounted()
        {
            this.unreadAssignments().forEach(a => a.addCallback(() => this.$forceUpdate()));
        }

        unreadAssignments(): Assignment[]
        {
            return this.course.assignments.filter(a => a.unread);
        }

        unread(): number
        {
            return this.unreadAssignments().length;
        }
    }
</script>
<style src="./overall-course.scss" lang="scss" scoped/>
