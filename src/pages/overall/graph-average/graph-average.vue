<template>
    <div id="graph-average">
        <ve-histogram :data="convertChart" :extend="settings"></ve-histogram>
    </div>
</template>

<script src="./graph-average.ts" lang="ts"></script>
<style src="./graph-average.scss" lang="scss"></style>
