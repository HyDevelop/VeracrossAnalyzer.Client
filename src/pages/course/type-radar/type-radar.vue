<template>
    <div id="type-radar">
        <ve-radar height="420px" class="graph" :extend="{a: this.course.name}" :after-config="afterConfig"/>
    </div>
</template>

<script src="./type-radar.ts" lang="ts"></script>
