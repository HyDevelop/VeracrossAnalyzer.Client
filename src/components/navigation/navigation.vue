<template>
    <div id="navigation">
        <el-menu style="margin-bottom: 10px;" class="centered" mode="horizontal"
                 :default-active="activeIndex" @select="onSelect">

            <!--div id="nav-title">
                Veracross Analyzer
            </div-->

            <el-menu-item index="overall">Overall</el-menu-item>

            <el-submenu index="courses">
                <template slot="title">Courses</template>
                <el-menu-item v-for="course in courses"
                              :index="formatCourseIndex(course)"
                              :key="course.name">{{course.name}}</el-menu-item>
            </el-submenu>

            <el-button @click="signOut" id="sign-out-button" type="text">Sign Out</el-button>
        </el-menu>
        <div v-if="activeIndex.includes('course')" @click="nextCourse(-1)" id="prev-course">
            ▲ PREVIOUS COURSE ▲
        </div>
        <div v-if="activeIndex.includes('course')" @click="nextCourse(1)" id="next-course">
            ▼ NEXT COURSE ▼
        </div>
    </div>
</template>

<script src="./navigation.ts" lang="ts"></script>
<style src="./navigation.scss" lang="scss"></style>
