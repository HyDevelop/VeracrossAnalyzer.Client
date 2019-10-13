<template>
    <div id="loading">
        <div id="text">
            {{text}}
        </div>
    </div>
</template>

<script src="./loading.ts" lang="ts"></script>

<style scoped>
    #loading
    {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #00000065;
    }
</style>
