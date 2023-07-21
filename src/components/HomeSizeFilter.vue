<template>
    <div class="filter">
        <a-button-group size="small">
            <a-button @click="show">Square Feet <span v-if="modify_count > 0">({{ modify_count}})</span> <a-icon style="font-size: 11px;" :type="visible ? 'caret-up' : 'caret-down'" /></a-button>
            <a-button type="primary" v-if="modify_count > 0" @click="clear"><a-icon style="font-size: 11px;" type="close-circle" /></a-button>
        </a-button-group>
        <a-modal v-model="visible" :maskClosable="false">
            <h3>Square Feet</h3>
            <div class="modal-content">
                <a-checkbox-group v-model="selected_home_size_range">
                    <a-row>
                        <a-col :span="24">
                            <a-checkbox value="1000,1250">1000 - 1250</a-checkbox>
                            <a-checkbox value="1250,1500">1250 - 1500</a-checkbox>
                            <a-checkbox value="1500,1750">1500 - 1750</a-checkbox>
                        </a-col>
                        <a-col :span="24">
                            <a-checkbox value="1750,2000">1750 - 2000</a-checkbox>
                            <a-checkbox value="2000,2250">2000 - 2250</a-checkbox>
                            <a-checkbox value="2250,2500">2250 - 2500</a-checkbox>
                        </a-col>
                        <a-col :span="24">
                            <a-checkbox value="2500,5000">2500+</a-checkbox>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </div>
            <template slot="footer">
                <a-button @click="clear">Clear</a-button>
                <a-button type="primary" @click="save">Ok</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script type="text/javascript">
    import Modal from 'ant-design-vue/lib/modal';
    import Icon from 'ant-design-vue/lib/icon';
    import Button from 'ant-design-vue/lib/button';
    import ButtonGroup from 'ant-design-vue/lib/button/button-group';
    import CheckboxGroup from 'ant-design-vue/lib/checkbox/Group';
    import Checkbox from 'ant-design-vue/lib/checkbox';
    import Row from 'ant-design-vue/lib/row';
    import Column from 'ant-design-vue/lib/col';
    import 'ant-design-vue/lib/modal/style/css';
    import 'ant-design-vue/lib/icon/style/css';
    import 'ant-design-vue/lib/button/style/css';
    import 'ant-design-vue/lib/checkbox/style/css';
    import 'ant-design-vue/lib/row/style/css';
    import 'ant-design-vue/lib/col/style/css';

    export default {
        components: {
            'a-icon': Icon,
            'a-modal': Modal,
            'a-button': Button,
            'a-button-group': ButtonGroup,
            'a-checkbox': Checkbox,
            'a-checkbox-group': CheckboxGroup,
            'a-row': Row,
            'a-col': Column
        },
        props: {
            home_size_range: {
                type: Array
            }
        },
        data() {
            return {
                visible: false,
                selected_home_size_range: []
            }
        },
        computed: {
            modify_count() {
                return this.home_size_range.length;
            }
        },
        methods: {
            show() {
                this.selected_home_size_range = this.home_size_range;
                this.visible = true;
            },
            save() {
                this.$emit('update:home_size_range', this.selected_home_size_range);
                this.visible = false;
                this.$parent.refresh();
            },
            clear(needsRefresh = true) {
                this.selected_home_size_range = [];
                this.$emit('update:home_size_range', this.selected_home_size_range);
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