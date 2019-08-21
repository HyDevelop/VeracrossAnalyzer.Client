<template>
    <div id="navigation">
        <el-menu :default-active="activeIndex" mode="horizontal" @select="onSelect">

            <el-menu-item index="overall">Overall</el-menu-item>


        </el-menu>
        <div class="line"></div>
    </div>
</template>

<script src="./navigation.ts" lang="ts"></script>
<style src="./navigation.scss" lang="scss"></style>
