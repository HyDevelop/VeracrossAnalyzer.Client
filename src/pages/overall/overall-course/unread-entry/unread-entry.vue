<template>
    <div class="unread-entry vertical-center">
        <span>{{formatDate(new Date(assignment.date))}}</span>
        <span>{{assignment.type}}</span>
        <span>{{assignment.description}}</span>
        <span>{{assignment.score + '|' + assignment.scoreMax}}</span>
    </div>
</template>

<script src="./unread-entry.ts" lang="ts"></script>
<style src="./unread-entry.scss" lang="scss"></style>
