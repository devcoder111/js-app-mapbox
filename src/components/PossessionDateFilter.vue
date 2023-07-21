<template>
    <div class="filter">
        <a-date-picker size="small" placeholder="Possession Date" format="MMM DD, YYYY" :disabledDate="disabledDate" v-model="selected_date" @change="dateChanged" style="width: 150px;" />
    </div>
</template>

<script>
    import moment from 'moment';
    import DatePicker from 'ant-design-vue/lib/date-picker';
    import 'ant-design-vue/lib/date-picker/style/css';

    export default {
        components: {
            'a-date-picker': DatePicker
        },
        props: {
            possession_date: {
                type: String
            }
        },
        data() {
            return {
                selected_date: null
            }
        },
        mounted() {
            this.selected_date = this.possession_date != null ? moment(this.possession_date) : null;
        },
        watch: {
            possession_date() {
                this.selected_date = this.possession_date != null ? moment(this.possession_date) : null
            }
        },
        methods: {
            disabledDate(date) {
                return moment() > date;
            },
            dateChanged(date) {
                if (date != null) {
                    this.$emit('update:possession_date', date.format());
                } else {
                    this.$emit('update:possession_date', null);
                }
                this.$parent.refresh();
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>