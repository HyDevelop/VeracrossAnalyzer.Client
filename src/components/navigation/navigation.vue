<template>
    <div id="navigation">
        <el-menu style="margin-bottom: 10px;" class="centered" mode="horizontal"
                 :default-active="activeIndex" @select="onSelect">

            <div id="nav-title">
                <img id="nav-logo" alt="logo" src="../../assets/logo.png">
                <span id="nav-logo-text" class="logo-text">Veracross Analyzer</span>
                <span id="nav-logo-version">v{{version}}</span>
            </div>

            <el-menu-item index="overall">Overall</el-menu-item>

            <el-submenu index="courses">
                <template slot="title">Courses</template>
                <el-menu-item v-for="course in courses"
                              :index="formatCourseIndex(course)"
                              :key="course.name">{{course.name}}</el-menu-item>
            </el-submenu>

            <!-- Grading period selection -->
            <el-dropdown id="nav-grading-period" @command="selectGradingPeriod">
                <el-button type="primary" size="medium">
                    {{gradingPeriod}}<i class="el-icon-arrow-down el-icon--right"/>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="Term 1">Term 1</el-dropdown-item>
                    <el-dropdown-item command="Term 2">Term 2</el-dropdown-item>
                    <el-dropdown-item command="Term 3" disabled>Term 3</el-dropdown-item>
                    <el-dropdown-item command="Term 4" disabled>Term 4</el-dropdown-item>
                    <el-dropdown-item command="All Year" divided>All Year</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-button @click="$emit('sign-out')" id="sign-out-button" type="text">Sign Out</el-button>
        </el-menu>

        <!-- Previous course / Next course (Only when the page is courses) -->
        <div v-if="activeIndex.includes('course') && findNextCourse(-1) != null"
             @click="nextCourse(-1)" id="prev-course" class="nav-course-operations unselectable">
            ▲ PREVIOUS COURSE ▲
        </div>
        <footer>
            <div v-if="activeIndex.includes('course') && findNextCourse(1) != null"
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
