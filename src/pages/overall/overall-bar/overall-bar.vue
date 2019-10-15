<template>
    <div id="overall-bar">
        <ve-bar height="450px" class="graph"
                :extend="chartSettings"></ve-bar>
    </div>
</template>

<script src="./overall-bar.ts" lang="ts"></script>
<style lang="scss">
    #overall-bar
    {
        .graph
        {
            margin-top: 50px;
        }
    }
</style>
