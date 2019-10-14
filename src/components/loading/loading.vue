<template>
    <div id="loading">
        <div id="text">
            Loading

            <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                    <circle cx="50" cy="50" r="20" fill="none" class="path" />
                </svg>
            </div>

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
