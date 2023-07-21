<template>
    <div class="filter">
        <a-select v-model="selected_price_range" size="small" style="width: 100%;" @change="save">
            <a-select-option value="0,1000">Price</a-select-option>
            <a-select-option value="250,300">$250K - $300K</a-select-option>
            <a-select-option value="300,350">$300K - $350K</a-select-option>
            <a-select-option value="350,400">$350K - $400K</a-select-option>
            <a-select-option value="400,450">$400K - $450K</a-select-option>
            <a-select-option value="450,500">$450K - $500K</a-select-option>
            <a-select-option value="500,1000">$500K+</a-select-option>
        </a-select>
    </div>
</template>

<script type="text/javascript">
    import Select from 'ant-design-vue/lib/select';
    import 'ant-design-vue/lib/select/style/css';

    export default {
        components: {
            'a-select': Select,
            'a-select-option': Select.Option
        },
        props: {
            price_range: {
                type: Array
            }
        },
        data() {
            return {
                selected_price_range: '0,1000',
            }
        },
        mounted() {
            this.selected_price_range = this.price_range.join(',');
        },
        watch: {
            'price_range'() {
                this.selected_price_range = this.price_range.join(',');
            }
        },
        methods: {
            save() {
                this.$emit('update:price_range', this.selected_price_range.split(','));
                this.$parent.refresh();
            }
        }
    }
</script>