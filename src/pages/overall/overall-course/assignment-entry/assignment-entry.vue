<template>
    <div class="unread-entry vertical-center"
         :class="narrow ? 'narrow' : ''"
         :style="`background: ${backgroundColor}`">
        <el-row class="unread-row">
            <el-col :span="3" class="date">
                <span class="month">{{getMoment(assignment.date).format("MMM Do")}}</span>
                <span class="now">({{getMoment(assignment.date).fromNow()}})</span>
            </el-col>

            <el-col :span="15" class="description">
                <span class="type entry-box"
                      :style="`border-color: var(--assignment-type-${assignment.typeId})`">
                    {{assignment.type}}
                </span>
                <span class="text">{{assignment.description}}</span>
            </el-col>

            <el-col :span="6" class="grade">
                <span class="percent entry-box">
                    {{(assignment.score / assignment.scoreMax * 100).toFixed(1)}}
                    <span class="symbol">%</span>
                </span>
                <span class="score entry-box">{{assignment.score}}</span>
                <span class="max entry-box">{{assignment.scoreMax}}</span>

                <el-button class="mark-as-read" size="mini" type="text"
                           icon="el-icon-close" @click="markAsRead" v-if="unread">
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Assignment} from '@/components/app/app';
    import moment from 'moment';

    @Component
    export default class AssignmentEntry extends Vue
    {
        @Prop({required: true}) assignment: Assignment;

        @Prop({default: false}) unread: boolean;
        @Prop({default: '#f5f7fa'}) backgroundColor: string;
        @Prop({default: false}) narrow: boolean;

        /**
         * Format a date to the displayed format
         *
         * @param date Date
         */
        getMoment(date: string)
        {
            return moment(new Date(date));
        }

        /**
         * Mark this unread assignment as read
         */
        markAsRead()
        {
            // Call custom event
            this.$emit('mark-as-read', this.assignment)
        }
    }
</script>
<style src="./assignment-entry.scss" lang="scss" scoped></style>
