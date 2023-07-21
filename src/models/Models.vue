<template>
    <div class="page">
        <div class="header">
            <h1>Explore our floorplans</h1>
            <h2>with our interactive tool!</h2>
        </div>
        <div class="loading" v-if="loading">
            <img src="../assets/loading.gif" />
        </div>
        <div class="homes" v-if="!loading && items.length > 0">
            <home-box :item="item" :key="item.id" v-for="item in items"/>
        </div>
    </div>
</template>

<script type="text/javascript">
    import axios from "axios";
    import HomeBox from './HomeBox.vue';

    export default {
        components: {
            'home-box': HomeBox
        },
        data() {
            return {
                loading: false,
                items: []
            }
        },
        async mounted() {
            await this.loadModels();
        },
        methods: {
            async loadModels () {
                this.loading = true;
                let filterParams = {
                    post_type: 'home-designs',
                    bedrooms: 0,
                    bathrooms: 0,
                    price_range: '0-1000000',
                    sq_ft_range: '',
                    possession_date: 0,
                    home_styles: '',
                    community_ids: '',
                    features: '',
                    released_market: '',
                };
                let result = await axios.get('/wp-json/templatev2/v1/search', {params: filterParams});
                this.items = result.data.items;
                this.loading = false;
            }
        }
    }
</script>

<style lang="scss">
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap");

    body {
        font-family: "Roboto", sans-serif;
    }
</style>

<style lang="scss" scoped>
    .page {
        width: 98%;
        margin: 0 auto;

        .loading {
            text-align: center;
            margin: 5vh 0;
        }

        .header {
            padding: 5vh 0;

            h1 {
                font-size: 10vh;
                text-align: center;
                font-weight: 700;

                @media all and (max-width: 1050px) {
                    font-size: 6vh;
                }
            }

            h2 {
                font-size: 6vh;
                text-align: center;
                font-weight: 400;

                @media all and (max-width: 1050px) {
                    font-size: 4vh;
                }
            }
        }
    }

    .homes {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
            width: 33%;
            margin-bottom: 1vh;
        }
    }

    @media all and (max-width: 1050px) {
        .homes {
            .item {
                width: 49%;
            }
        }
    }
</style>