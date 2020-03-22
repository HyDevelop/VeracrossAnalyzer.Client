<template>
    <div id="assignment-type-head">
        <el-card :body-style="{padding: '0px'}">
            <div id="type-info-card">
                <span id="type-name">{{type.name}}</span>
                <span class="type-average" v-if="type.graded">Average: {{type.percent}}%</span>
                <span class="type-average" v-if="!type.graded">No grades yet!</span>
            </div>

            <AssignmentEntry v-for="(assignment, index) of filteredAssignments" :key="assignment.id"
                             :assignment="assignment" :unread="false"
                             :backgroundColor="index % 2 === 1 ? '#ffffff' : '#f7f7f7'" narrow="true">
            </AssignmentEntry>
        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';
    import {Assignment, AssignmentType} from '@/logic/course';

    @Component({
        components: {AssignmentEntry}
    })
    export default class AssignmentTypeHead extends Vue
    {
        @Prop({required: true}) type: AssignmentType;
        @Prop({required: true}) assignments: Assignment[];

        get filteredAssignments()
        {
            // Filter assignments to only this type
            return this.assignments.filter(a => a.typeId == this.type.id);
        }
    }
</script>

<style lang="scss" scoped>
    #assignment-type-head
    {
        margin-bottom: 20px;
    }

    #type-info-card
    {
        height: 60px;
    }

    #type-name
    {
        // Font
        font-size: 22px;
        color: var(--main);

        // Center
        height: 60px;
        line-height: 60px;

        // Alignment
        padding-left: 20px;
        float: left;
    }

    .type-average
    {
        // Font
        font-size: 14px;
        color: #8db3e4;

        // Center
        height: 60px;
        line-height: 64px;

        // Alignment
        float: left;
        margin-left: 15px;
        display: inline-block;
    }
</style>
