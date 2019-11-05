<template>
    <div id="assignment-type-head">
        <el-card :body-style="{padding: '0px'}">
            <span>{{typeName}}</span>

            <AssignmentEntry v-for="assignment of filteredAssignments" :key="assignment.id"
                             :assignment="assignment">
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
    }
</script>

<style lang="scss">
#assignment-type-head
{

}
</style>
