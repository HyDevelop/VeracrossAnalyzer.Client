<template>
    <div id="settings">
        <div class="header">Settings</div>
        <el-divider class="divider"><i class="el-icon-s-tools"></i></el-divider>

        <div class="content">
            <el-switch v-model="settings.showAllCourses" class="item"
                       active-text="Show all courses (including the ones not listed on your grade level)"/>

            <div class="item">
                <span class="item-label">Sort by:</span>
                <el-radio-group v-model="settings.sortBy">
                    <el-radio label="Name"></el-radio>
                    <el-radio label="Popularity"></el-radio>
                    <el-radio label="Classes"></el-radio>
                    <el-radio label="Level"></el-radio>
                    <el-radio disabled label="Peer Rating (Coming soon)"></el-radio>
                </el-radio-group>
            </div>

            <div class="item">
                <span class="item-label">Levels:</span>
                <el-checkbox-group v-model="settings.levels" style="display: inline-block;">
                    <el-checkbox label="AP">AP</el-checkbox>
                    <el-checkbox label="H">Honors</el-checkbox>
                    <el-checkbox label="A">Accelerated</el-checkbox>
                    <el-checkbox label="CP">CP</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator'

    @Component
    export default class SearchSettingsComponent extends Vue
    {
        @Prop({required: true}) settings: SearchSettings;
        // TODO: Show all courses option
    }

    export class SearchSettings
    {
        showAllCourses: boolean = false
        sortBy: string = 'Name'
        levels: string[] = ['AP','H','A','CP']
    }
</script>

<style src="./pages.scss" lang="scss" scoped/>
<style lang="scss" scoped>
    .content
    {
        text-align: left;

        .item
        {
            margin-bottom: 20px;
            font-size: 14px;

            .item-label,.el-radio
            {
                margin-right: 15px;
            }
        }
    }
</style>
