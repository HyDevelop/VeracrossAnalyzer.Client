<template>
    <div id="assignment-type-head">
        <el-card>

        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Assignment} from '@/components/app/app';

    @Component
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
            this.filteredAssignments = this.assignments.filter(a => a.type === this.typeName);
        }
    }
</script>

<style scoped>

</style>
