<template>
    <div id="navigation">
        <el-menu class="centered" :default-active="activeIndex" mode="horizontal" @select="onSelect">

            <!--div id="nav-title">
                Veracross Analyzer
            </div-->

            <el-menu-item index="overall">Overall</el-menu-item>

            <el-submenu index="courses">
                <template slot="title">Courses</template>
                <el-menu-item v-for="course in courses"
                              :index="`course-${course.name}`"
                              :key="course.name">{{course.name}}</el-menu-item>
            </el-submenu>

            <el-button @click="signOut" id="sign-out-button" type="text">Sign Out</el-button>
        </el-menu>
        <div class="line"></div>
    </div>
</template>

<script src="./navigation.ts" lang="ts"></script>
<style src="./navigation.scss" lang="scss"></style>
