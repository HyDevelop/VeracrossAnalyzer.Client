<template>
    <div id="graph-overall">
        <ve-line :data="chart" :extend="{series: {smooth: false}}"></ve-line>
    </div>
</template>

<script src="./graph-overall.ts" lang="ts"></script>
<style src="./graph-overall.scss" lang="scss"></style>
