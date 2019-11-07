<template>
    <div id="navigation">
        <el-menu style="margin-bottom: 10px;" class="centered" mode="horizontal"
                 :default-active="activeIndex" @select="onSelect">

            <div id="nav-title">
                Veracross Analyzer
            </div>

            <el-menu-item index="overall">Overall</el-menu-item>

            <el-submenu index="courses">
                <template slot="title">Courses</template>
                <el-menu-item v-for="course in courses"
                              :index="formatCourseIndex(course)"
                              :key="course.name">{{course.name}}</el-menu-item>
            </el-submenu>

            <!-- Time selection -->
            <el-dropdown id="nav-time-selection">
                <el-button type="primary" size="medium">
                    {{selectedTime}}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="Term 1">Term 1</el-dropdown-item>
                    <el-dropdown-item command="Term 2">Term 2</el-dropdown-item>
                    <el-dropdown-item command="Term 3" disabled>Term 3</el-dropdown-item>
                    <el-dropdown-item command="Term 4" disabled>Term 4</el-dropdown-item>
                    <el-dropdown-item command="All Year" divided>All Year</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <el-button @click="signOut" id="sign-out-button" type="text">Sign Out</el-button>
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
    </div>
</template>

<script src="./navigation.ts" lang="ts"></script>
<style src="./navigation.scss" lang="scss"></style>
