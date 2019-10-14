<template>
    <div id="app" class="theme-default">
        <login v-if="showLogin" v-on:login:token="onLogin"></login>
        <navigation :courses="filteredCourses"
                    :activeIndex.sync="selectedTab"
                    v-on:sign-out="signOut">
        </navigation>

        <div id="app-content">
            <overall :courses="filteredCourses"
                     v-if="selectedTab === 'overall' && assignmentsReady">
            </overall>
            <course-page></course-page>
        </div>

        <loading v-if="loading !== ''" :text="loading" :error="loadingError"></loading>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"></style>
