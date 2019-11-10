<template>
    <div id="login" class="login-overlay">
        <div class="login-vertical-center">
            <div class="login-panel">
                <img alt="Vue logo" src="../../assets/logo.png">

                <h1>Veracross Analyzer</h1>
                <form id="login-form">
                    <el-input v-model="username"
                              placeholder="SJP Username (Eg. flast21)"
                              :class="{'input-error': error !== ''}"
                              @keyup.enter.native="onEnter">
                    </el-input>

                    <el-input v-model="password"
                              placeholder="SJP Password"
                              show-password=""
                              :class="{'input-error': error !== ''}"
                              @keyup.enter.native="onEnter">
                    </el-input>

                    <div class="el-form-item__error custom">{{error}}</div>

                    <el-button plain type="primary" @click="onLoginClick" :loading="loading">Login</el-button>
                </form>
            </div>
        </div>
    </div>
</template>

<script src="./login.ts" lang="ts"></script>
<style src="./login.scss" lang="scss"></style>
