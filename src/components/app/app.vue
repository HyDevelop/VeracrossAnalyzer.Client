<template>
    <div id="app" class="theme-default">
        <login v-if="showLogin" v-on:login:user="onLogin"/>
        <navigation v-if="user != null"
                    :courses="filteredCourses"
                    :activeIndex.sync="selectedTab"
                    :user="user"
                    @sign-out="signOut" @select-time="selectTime">
        </navigation>

        <div id="app-content" v-if="assignmentsReady && loading === ''">
            <overall v-if="selectedTab === 'overall'"
                     :courses="filteredCourses">
            </overall>
            <course-page v-if="selectedTab.split('/')[0] === 'course'"
                         :course="filteredCourses.find(c => +c.id === +selectedTab.split('/')[1])">
            </course-page>
        </div>

        <loading v-if="loading !== ''" :text="loading" :error="loadingError"/>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"/>
