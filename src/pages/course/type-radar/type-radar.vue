<template>
    <div id="type-radar">
        <ve-radar height="450px" class="graph" :extend="{a: this.course.name}" :after-config="afterConfig"></ve-radar>
    </div>
</template>

<script src="./type-radar.ts" lang="ts"></script>
<style lang="scss" scoped></style>
