<template>
    <div id="login" class="login-overlay">
        <div class="login-panel">
            <img alt="Vue logo" src="../../assets/logo.png">
            <h1>Veracross Analyzer</h1>
            <el-input v-model="username" placeholder="School Username"></el-input>
            <el-input v-model="password" placeholder="Veracross Password" show-password=""></el-input>
            <el-button plain type="primary" @click="onLoginClick" loading="{{loading}}">Login</el-button>
        </div>
    </div>
</template>

<script src="./login.ts" lang="ts"></script>
<style src="./login.scss" lang="scss"></style>
