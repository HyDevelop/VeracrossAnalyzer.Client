<template>
    <div id="assignment-type-head">
        <el-card :body-style="{padding: '0px'}">
            <div id="type-info-card">
                <span id="type-name">{{typeName}}</span>
                <span id="type-average">Average: {{average.toFixed(2)}}%</span>
            </div>

            <AssignmentEntry v-for="assignment of filteredAssignments" :key="assignment.id"
                             :assignment="assignment" :unread="false"
                             backgroundColor="#ffffff" narrow="true">
            </AssignmentEntry>
        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Assignment} from '@/components/app/app';
    import AssignmentEntry from '@/pages/overall/overall-course/assignment-entry/assignment-entry.vue';

    @Component({
        components: {AssignmentEntry}
    })
    export default class AssignmentTypeHead extends Vue
    {
        @Prop({required: true}) typeName: string;
        @Prop({required: true}) assignments: Assignment[];

        filteredAssignments: Assignment[];

        /**
         * Called when this component is created
         */
        created()
        {
            // Filter assignments to only this type
            this.filteredAssignments = this.assignments.filter(a => a.type == this.typeName);
        }

        get average()
        {
            return this.filteredAssignments.reduce((a, b) => a + b.score, 0) /
                this.filteredAssignments.reduce((a, b) => a + b.scoreMax, 0) * 100;
        }
    }
</script>

<style lang="scss" scoped>
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
</style>
