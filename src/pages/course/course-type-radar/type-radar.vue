<template>
    <div id="course-scatter">
        <ve-radar height="450px" class="graph" :extend="{a: this.course.name}" :after-config="afterConfig"></ve-radar>
    </div>
</template>

<script src="./type-radar.ts" lang="ts"></script>
<style lang="scss" scoped>
    #overall-bar
    {
        .graph
        {
            margin-top: 50px;
        }
    }
</style>
