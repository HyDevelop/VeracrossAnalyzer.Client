<template>
    <div id="app" class="theme-default">
        <login v-if="showLogin" v-on:login:token="onLogin"></login>
        <navigation :courses="filteredCourses"
                    v-on:sign-out="signOut()"
                    v-on:navigation:select="onNavigate">
        </navigation>

        <div id="app-content">
            <overall :courses="filteredCourses"
                     v-if="selectedTab === 'overall' && assignmentsReady">
            </overall>
        </div>

        <loading :text="'hi'"></loading>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"></style>
