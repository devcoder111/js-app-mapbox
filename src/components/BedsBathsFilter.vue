<template>
    <div class="filter">
        <a-button-group size="small" style="width: 100%;">
            <a-button @click="show">{{ bedsSelectedValue }} Beds, {{ bathsSelectedValue }} Baths <a-icon style="font-size: 11px;" :type="visible ? 'caret-up' : 'caret-down'" /></a-button>
            <a-button type="primary" v-if="modified" @click="clear"><a-icon style="font-size: 11px;" type="close-circle" /></a-button>
        </a-button-group>
        <a-modal v-model="visible" :maskClosable="false">
            <h3>Beds & Baths</h3>
            <div class="modal-content">
                <h4>Beds</h4>
                <a-radio-group :options="bed_items" v-model="selected_beds" />
                <h4 style="margin-top: 20px;">Baths</h4>
                <a-radio-group :options="bath_items" v-model="selected_baths" />
            </div>
            <template slot="footer">
                <a-button @click="clear">Clear</a-button>
                <a-button type="primary" @click="save">Ok</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
    import Modal from 'ant-design-vue/lib/modal';
    import RadioGroup from 'ant-design-vue/lib/radio/Group';
    import Icon from 'ant-design-vue/lib/icon';
    import Button from 'ant-design-vue/lib/button';
    import ButtonGroup from 'ant-design-vue/lib/button/button-group';
    import 'ant-design-vue/lib/radio/style/css';
    import 'ant-design-vue/lib/modal/style/css';
    import 'ant-design-vue/lib/icon/style/css';
    import 'ant-design-vue/lib/button/style/css';

    export default {
        components: {
            'a-radio-group': RadioGroup,
            'a-modal': Modal,
            'a-icon': Icon,
            'a-button': Button,
            'a-button-group': ButtonGroup
        },
        props: {
            beds: {
                type: Number
            },
            baths: {
                type: Number
            }
        },
        data() {
            return {
                visible: false,
                selected_beds: 0,
                selected_baths: 0,
                bed_items: [
                    {label: '0+', value: 0},
                    {label: '1+', value: 1},
                    {label: '2+', value: 2},
                    {label: '3+', value: 3},
                    {label: '4+', value: 4},
                    {label: '5+', value: 5},
                    {label: '6+', value: 6}
                ],
                bath_items: [
                    {label: '0+', value: 0},
                    {label: '1+', value: 1},
                    {label: '2+', value: 2},
                    {label: '3+', value: 3},
                    {label: '4+', value: 4},
                    {label: '5+', value: 5},
                    {label: '6+', value: 6}
                ]
            }
        },
        computed: {
            modified() {
                return this.beds > 0 || this.baths > 0;
            },
            bedsSelectedValue() {
                if (this.beds > 0) {
                    return this.beds + '+';
                } else {
                    return '#';
                }
            },
            bathsSelectedValue() {
                if (this.baths > 0) {
                    return this.baths + '+';
                } else {
                    return '#';
                }
            }
        },
        methods: {
            show() {
                this.visible = true;
                this.selected_beds = this.beds;
                this.selected_baths = this.baths;
            },
            save(needsRefresh = true) {
                this.$emit('update:beds', this.selected_beds);
                this.$emit('update:baths', this.selected_baths);
                this.visible = false;
                this.$parent.refresh();
            },
            clear(needsRefresh = true) {
                this.selected_beds = 0;
                this.selected_baths = 0;
                this.$emit('update:beds', this.selected_beds);
                this.$emit('update:baths', this.selected_baths);
                this.visible = false;
                this.$parent.refresh();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-content {
        padding: 10px;
    }
</style>