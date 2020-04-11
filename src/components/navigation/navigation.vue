<template>
    <div id="navigation">
        <el-menu style="margin-bottom: 10px;" class="centered" mode="horizontal"
                 :default-active="nav.id" @select="onSelect">

            <div id="nav-title">
                <img id="nav-logo" alt="logo" src="../../assets/logo.png">
                <span id="nav-logo-text" class="logo-text">Veracross Analyzer</span>
                <span id="nav-logo-version">v{{version}}</span>
            </div>

            <el-menu-item index="overall">Overall</el-menu-item>

            <el-submenu index="">
                <template slot="title">Courses</template>
                <el-menu-item v-for="course in app.gradedCourses"
                              :index="JSON.stringify(course.urlIndex)"
                              :key="course.id">{{course.name}}</el-menu-item>
            </el-submenu>

            <el-menu-item index="course-selection">Course Selection</el-menu-item>

            <!-- Grading period selection -->
            <el-dropdown id="nav-grading-period" @command="selectGradingPeriod">
                <el-button type="primary" size="medium">
                    {{gradingPeriod}}<i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="Term 1">Term 1</el-dropdown-item>
                    <el-dropdown-item command="Term 2">Term 2</el-dropdown-item>
                    <el-dropdown-item command="Term 3">Term 3</el-dropdown-item>
                    <el-dropdown-item command="Term 4">Term 4</el-dropdown-item>
<!--                    TODO: Auto enable / disable quarters -->
                    <el-dropdown-item command="All Year" divided>All Year</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <!-- User avatar -->
            <el-dropdown id="nav-avatar" trigger="click" @command="onAvatarMenu">
                <el-avatar :src="user.avatarUrl"/>

                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="text-align: center">{{user.nickname}}</el-dropdown-item>

                    <el-dropdown-item icon="el-icon-sunrise" command="switch-dark" divided>{{!isDark() ? 'Dark Mode (Unfinished)' : 'Light Mode'}}</el-dropdown-item>

                    <el-dropdown-item icon="el-icon-switch-button" command="sign-out" divided>Sign Out</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu>

        <!-- Previous course / Next course (Only when the page is courses) -->
        <div v-if="nav.id === 'course' && findNextCourse(-1) != null"
             @click="nextCourse(-1)" id="prev-course" class="nav-course-operations unselectable">
            ▲ PREVIOUS COURSE ▲
        </div>
        <footer>
            <div v-if="nav.id === 'course' && findNextCourse(1) != null"
                 @click="nextCourse(1)" id="next-course" class="nav-course-operations unselectable">
                ▼ NEXT COURSE ▼
            </div>
        </footer>

        <!-- Back to top -->
        <el-backtop style="box-shadow: rgba(0, 0, 0, 0.23) 0 3px 11px 0;"/>
    </div>
</template>

<script src="./navigation.ts" lang="ts"></script>
<style src="./navigation.scss" lang="scss"/>
