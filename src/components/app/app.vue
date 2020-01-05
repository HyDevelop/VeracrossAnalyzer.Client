<template>
    <div id="app" class="theme-default">
        <div id="app-inner" v-if="staticPage === ''" :class="{dark: darkMode}">
            <login v-if="showLogin" v-on:login:user="onLogin"/>
            <navigation v-if="user != null"
                        :courses="gradedCourses"
                        :user="user"
                        :nav="nav"
                        @sign-out="signOut" @select-time="selectTime">
            </navigation>

            <div id="app-content" v-if="assignmentsReady && loading === ''">
                <overall v-if="nav.id === 'overall'"
                         :courses="gradedCourses">
                </overall>
                <course-page v-if="nav.id === 'course'"
                             :course="gradedCourses.find(c => +c.id === +nav.info.id)">
                </course-page>
            </div>

            <loading v-if="loading !== ''" :text="loading" :error="loadingError"/>
        </div>

        <Info v-if="staticPage === 'info'"/>
    </div>
</template>

<script src="./app.ts" lang="ts"></script>
<style src="./app.scss" lang="scss"/>
