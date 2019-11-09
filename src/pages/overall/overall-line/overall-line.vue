<template>
    <div id="overall-line">
        <ve-line :data="convertChart" :extend="{a: this.courses}" :after-config="afterConfig"></ve-line>
    </div>
</template>

<script src="./overall-line.ts" lang="ts"></script>
<style lang="scss" scoped>
    
</style>
