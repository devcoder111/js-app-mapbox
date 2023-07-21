<template>
    <div class="filter">
        <a-button-group size="small">
            <a-button @click="show">Features <span v-if="modify_count > 0">({{ modify_count}})</span> <a-icon style="font-size: 11px;" :type="visible ? 'caret-up' : 'caret-down'" /></a-button>
            <a-button type="primary" v-if="modify_count > 0" @click="clear"><a-icon style="font-size: 11px;" type="close-circle" /></a-button>
        </a-button-group>
        <a-modal v-model="visible" :maskClosable="false">
            <h3>Included or optional build features</h3>
            <div class="modal-content">
                <a-checkbox-group v-model="selected_features">
                    <a-row>
                        <a-col v-for="feature in feature_items" :span="8" :key="feature.value">
                            <a-checkbox :value="feature.value">{{feature.label}}</a-checkbox>
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
    import CheckboxGroup from 'ant-design-vue/lib/checkbox/Group';
    import Checkbox from 'ant-design-vue/lib/checkbox';
    import Modal from 'ant-design-vue/lib/modal';
    import Icon from 'ant-design-vue/lib/icon';
    import Button from 'ant-design-vue/lib/button';
    import ButtonGroup from 'ant-design-vue/lib/button/button-group';
    import Row from 'ant-design-vue/lib/row';
    import Column from 'ant-design-vue/lib/col';
    import 'ant-design-vue/lib/row/style/css';
    import 'ant-design-vue/lib/col/style/css';
    import 'ant-design-vue/lib/select/style/css';
    import 'ant-design-vue/lib/checkbox/style/css';
    import 'ant-design-vue/lib/modal/style/css';
    import 'ant-design-vue/lib/icon/style/css';
    import 'ant-design-vue/lib/button/style/css';
    import 'ant-design-vue/lib/radio/style/css';

    export default {
        components: {
            'a-checkbox': Checkbox,
            'a-checkbox-group': CheckboxGroup,
            'a-icon': Icon,
            'a-modal': Modal,
            'a-button': Button,
            'a-button-group': ButtonGroup,
            'a-row': Row,
            'a-col': Column
        },
        props: {
            features: {
                type: Array
            }
        },
        data() {
            return {
                visible: false,
                selected_features: [],
                feature_items: [
                    {label: 'Seperate Entrance', value: 'seperate_entrance'},
                    {label: '4 Bedroom Option', value: 'four_bedrooms'},
                    {label: '5 Bedroom Option', value: 'five_bedrooms'},
                    {label: 'Bonus Room', value: 'bonus_room'},
                    {label: 'Upstairs Laundry', value: 'upstairs_laundry'},
                    {label: 'Legal Suite', value: 'legal_suite'},
                    {label: 'Den / Flex Room', value: 'flex_room'},
                    {label: '3 Piece Ensuite', value: 'three_ensuite'},
                    {label: '4 Piece Ensuite', value: 'four_ensuite'},
                    {label: '5 Piece Ensuite', value: 'five_ensuite'},
                    {label: 'Spice Kitchen', value: 'spice_kitchen'},
                    {label: 'Walkout Basement', value: 'walkout'},
                    {label: 'Evolve', value: 'evolve'}
                ]
            }
        },
        computed: {
            modify_count() {
                return this.features.length || 0;
            }
        },
        methods: {
            show() {
                this.selected_features = this.features;
                this.visible = true;
            },
            save() {
                this.$emit('update:features', this.selected_features);
                this.visible = false;
                this.$parent.refresh();
            },
            clear(needsRefresh = true) {
                this.selected_features = [];
                this.$emit('update:features', this.selected_features);
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