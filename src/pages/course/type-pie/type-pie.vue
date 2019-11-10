<template>
    <div id="type-pie">
        <ve-pie height="450px" class="graph" :extend="{a: this.course.name}" :after-config="afterConfig"></ve-pie>
    </div>
</template>

<script src="./type-pie.ts" lang="ts"></script>
<style lang="scss" scoped></style>
