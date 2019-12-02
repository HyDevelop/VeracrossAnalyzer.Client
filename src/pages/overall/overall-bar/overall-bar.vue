<template>
    <div id="overall-bar">
        <ve-bar height="450px" class="graph" :extend="chartSettings"/>
    </div>
</template>

<script src="./overall-bar.ts" lang="ts"></script>
<style lang="scss" scoped>
    #overall-bar
    {
        .graph
        {
            margin-top: 50px;
        }
    }
</style>
