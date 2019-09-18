<template>
    <div id="app">
        <login v-if="showLogin" v-on:login:token="onLogin" :http="http"></login>
        <navigation :courses="courses" v-on:navigation:select="onNavigate"></navigation>

        <div id="app-content">
            <overall :courses="courses" v-if="selectedTab === 'overall' && assignmentsReady"></overall>
        </div>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"></style>
