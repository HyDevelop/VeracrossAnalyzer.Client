<template>
    <div id="course-scatter">
        <ve-scatter height="450px" class="graph" :extend="chartSettings" :after-config="afterConfig"></ve-scatter>
    </div>
</template>

<script src="./course-scatter.ts" lang="ts"></script>
<style lang="scss" scoped>
    #overall-bar
    {
        .graph
        {
            margin-top: 50px;
        }
    }
</style>
