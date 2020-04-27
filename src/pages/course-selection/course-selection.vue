<template>
    <div id="course-selection">
        <div v-if="loading" class="loading vertical-center" style="height: 100%">
            <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                    <circle cx="50" cy="50" r="20" fill="none" class="path"/>
                </svg>
            </div>
        </div>

        <el-row v-else>
            <el-col :span="16" class="overall-span">
                <el-card class="left" :style="{height: cardsHeight + 'px'}">
                    <SearchSettings v-if="openedPage === 'settings'" ref="settings" :settings="settings"/>
                    <Welcome v-if="openedPage === ''" :app="app"/>
                    <CourseDetail v-if="openedPage === 'course'" :unique-course="activeCourse"/>
                </el-card>
            </el-col>

            <!-- Course list card -->
            <el-col :span="8" class="overall-span">
                <el-card id="course-list" class="right" ref="cl" body-style="padding: 0" :style="{height: cardsHeight + 'px'}">
                    <div class="header padding-fix">
                        <div class="text">Course List</div>

                        <!-- Search -->
                        <el-input class="search" placeholder="Search..." prefix-icon="el-icon-search" v-model="search">
                            <el-button slot="append" icon="el-icon-s-tools" @click="openSettings"/>
                        </el-input>
                    </div>

                    <!-- Actual course list -->
                    <div class="list padding-fix" :style="{height: courseListHeight + 'px'}">
                        <!-- Every course -->
                        <div v-for="(course, index) in uniqueCourses" class="item vertical-center clickable unselectable"
                             @click="openCourse(course)">

                            <div class="name">{{course.name}}</div>
                            <div class="data">
                                <span class="classes"><i class="el-icon-s-home"/> {{course.classes.length}}</span>
                                <span class="teachers"><i class="el-icon-user-solid"/> {{course.courses.length}}</span>
                                <span class="enrollments"><i class="el-icon-user"/> {{course.enrollments}}</span>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script src="./course-selection.ts" lang="ts"/>
<style src="./course-selection.scss" lang="scss" scoped/>
