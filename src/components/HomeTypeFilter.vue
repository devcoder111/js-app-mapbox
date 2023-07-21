<template>
    <div class="filter">
        <a-button-group size="small">
            <a-button @click="show" :disabled="loading">Home Type <span v-if="modify_count > 0">({{ modify_count}})</span> <a-icon style="font-size: 11px;" :type="visible ? 'caret-up' : 'caret-down'" /></a-button>
            <a-button type="primary" :disabled="loading" v-if="modify_count > 0" @click="clear"><a-icon style="font-size: 11px;" type="close-circle" /></a-button>
        </a-button-group>
        <a-modal v-model="visible" :maskClosable="false">
            <h3>Home Types</h3>
            <div class="modal-content">
                <a-checkbox-group :options="home_type_items" v-model="selected_home_types" />
            </div>
            <div v-if="$route.name !== 'home-designs'">
              <h3>Models</h3>
              <div class="modal-content">
                  <a-checkbox-group v-model="selected_model_ids">
                    <div style="display: flex; justify-content: flex-start; flex-wrap: wrap; width: 400px;">
                      <div v-for="model of models" style="width: 200px;">
                        <a-checkbox :value="model.id" :checked="selected_model_ids.indexOf(model.id) > -1">{{model.title}}</a-checkbox>
                      </div>
                    </div>
                  </a-checkbox-group>
              </div>
            </div>
            <template slot="footer">
                <a-button @click="clear">Clear</a-button>
                <a-button type="primary" @click="save">Ok</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script type="text/javascript">
    import axios from "axios";
    import CheckboxGroup from 'ant-design-vue/lib/checkbox/Group';
    import Checkbox from 'ant-design-vue/lib/checkbox';
    import Modal from 'ant-design-vue/lib/modal';
    import Icon from 'ant-design-vue/lib/icon';
    import Button from 'ant-design-vue/lib/button';
    import ButtonGroup from 'ant-design-vue/lib/button/button-group';
    import 'ant-design-vue/lib/checkbox/style/css';
    import 'ant-design-vue/lib/slider/style/css';
    import 'ant-design-vue/lib/modal/style/css';
    import 'ant-design-vue/lib/icon/style/css';
    import 'ant-design-vue/lib/button/style/css';

    export default {
        components: {
            'a-checkbox': Checkbox,
            'a-checkbox-group': CheckboxGroup,
            'a-icon': Icon,
            'a-modal': Modal,
            'a-button': Button,
            'a-button-group': ButtonGroup
        },
        props: {
            home_types: {
                type: Array
            },
            model_ids: {
                type: Array
            }
        },
        data() {
            return {
                loading: false,
                visible: false,
                selected_home_types: [],
                home_type_items: [
                    {label: 'Townhomes', value: 'townhome'},
                    {label: 'Duplex Homes', value: 'duplex'},
                    {label: 'Laned Homes', value: 'laned'},
                    {label: 'Front Attached Home', value: 'sterling'}
                ],
                models: [],
                selected_model_ids: []
            }
        },
        computed: {
            modify_count() {
                let counter = this.home_types.length;
                if (Array.isArray(this.model_ids)) {
                    counter = counter + this.model_ids.length;
                }
                return counter;
            }
        },
        mounted() {
            let $this = this;
            this.loading = true;
            axios.get('/wp-json/templatev2/v1/models').then(response => {
                $this.loading = false;
                $this.models = response.data;
            });
        },
        methods: {
            show() {
                this.selected_home_types = this.home_types;
                this.selected_model_ids = this.model_ids;
                this.visible = true;
            },
            save() {
                this.$emit('update:home_types', this.selected_home_types);
                this.$emit('update:model_ids', this.selected_model_ids);
                this.visible = false;
                this.$parent.refresh();
            },
            clear(needsRefresh = true) {
                this.selected_home_types = [];
                this.selected_model_ids = [];
                this.$emit('update:home_types', this.selected_home_types);
                this.$emit('update:model_ids', this.selected_model_ids);
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