<template>
    <div id="loading">
        <div id="text">
            Loading

            <div id="details">{{text}}</div>
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

        text-align: center;
    }

    #text
    {
        color: white;

        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 46px;
    }

    #details
    {
        font-size: 16px;
    }
</style>
