<template>
    <div id="settings">
        <div class="header">Settings</div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'

    @Component
    export default class SearchSettings extends Vue
    {

    }
</script>

<style lang="scss" scoped>
    .header
    {
        margin-top: 15px;
        margin-bottom: 10px;

        font-size: 24px;
    }
</style>
