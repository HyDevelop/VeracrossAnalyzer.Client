<template>
    <div id="login" class="login-overlay">
        <div class="login-vertical-center">
            <div class="login-panel">
                <img id="login-logo-image" alt="logo" src="../../assets/logo.png">

                <h1>Veracross Analyzer</h1>
                <form id="login-form">
                    <el-input v-model="username"
                              placeholder="SJP Username (Eg. flast21)"
                              :class="{'input-error': error !== ''}"
                              v-if="!disableInput"
                              @keyup.enter.native="loginClick">
                    </el-input>

                    <el-input v-model="password"
                              placeholder="SJP Password"
                              show-password=""
                              :class="{'input-error': error !== ''}"
                              v-if="!disableInput"
                              @keyup.enter.native="loginClick">
                    </el-input>

                    <div class="el-form-item__error custom">{{error}}</div>

                    <el-button plain type="primary" @click="loginClick" :loading="loading">Login</el-button>
                </form>
            </div>
        </div>

        <Maintenance v-if="maintenance" :message="maintenance"/>
    </div>
</template>

<script src="./login.ts" lang="ts"></script>
<style src="./login.scss" lang="scss"/>
