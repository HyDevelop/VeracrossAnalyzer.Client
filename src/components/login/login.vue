<template>
    <div id="login">
        <el-input v-model="username" placeholder="School Username"></el-input>
        <el-input v-model="password" placeholder="Veracross Password" show-password=""></el-input>
        <el-button plain type="primary">Login</el-button>
    </div>
</template>

<script src="./login.ts" lang="ts"></script>
<style src="./login.scss" lang="scss"></style>
