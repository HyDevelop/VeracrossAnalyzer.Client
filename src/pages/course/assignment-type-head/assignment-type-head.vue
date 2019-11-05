<template>
    <div id="assignment-type-head">
        <el-card>

        </el-card>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class AssignmentTypeHead extends Vue
    {
        @Prop({required: true}) typeName: string;
    }
</script>

<style scoped>

</style>
