<template>
    <div id="graph-overall">
        <p>Your average score graph all time:</p>
        <ve-line :data="chart" :extend="settings"></ve-line>
    </div>
</template>

<script src="./graph-overall.ts" lang="ts"></script>
<style src="./graph-overall.scss" lang="scss"></style>
