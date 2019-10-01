<template>
    <div id="graph-overall">
        <ve-line :data="convertChart" :extend="settings"></ve-line>
    </div>
</template>

<script src="./overall-line.ts" lang="ts"></script>
<style src="./overall-line.scss" lang="scss"></style>
