<template>
    <div id="app">
        <login v-if="showLogin" v-on:login:courses="onLogin"></login>
        <navigation :courses="courses"></navigation>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"></style>
