<template>
    <div class="item">
        <div class="image-container">
            <img v-lazy="home_image" />
            <a class="nav-left" v-if="item.gallery.length > 0" @click="prevPhoto()">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-md" width="35" height="35" stroke-width="3" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><polyline points="15 6 9 12 15 18"></polyline></svg>
            </a>
            <a class="nav-right" v-if="item.gallery.length > 0" @click="nextPhoto()">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-md" width="35" height="35" stroke-width="3" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><polyline points="9 6 15 12 9 18"></polyline></svg>
            </a>
            <div class="specification" v-if="item.sold === false && item.specification !== false && item.specification !== ''">
                <div class="img-container" v-if="item.specification === 'evolve'"><img src="../assets/evolve.png" /></div>
                <div class="img-container" v-if="item.specification === 'advantage'"><img src="../assets/advantage.png" /></div>
            </div>
        </div>
        <div class="content">
            <h3 v-html="item.title"></h3>
        </div>
        <div class="info-box">
            <div class="features">
                <div class="feature"><img src="../assets/home.png" alt="" width="24px" /> {{ item.sq_ft }} sqft</div>
                <div class="feature"><img src="../assets/bed.png" alt="" width="24px" /> {{ item.bedrooms }}</div>
                <div class="feature"><img src="../assets/bath.png" alt="" width="24px" /> {{ item.bathrooms }}</div>
            </div>
            <div class="details">
                <a @click.prevent="openFloorplan()" :class="{disabled: item.floorplan_link === null || item.floorplan_link === ''}">
                    View Interactive Floorplan
                </a>
                <a @click.prevent="openTour()" :class="{disabled: item.matterport === null || item.matterport === ''}">
                    View 3D Tour
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import fancyBox from '@fancyapps/fancybox';
    import '@fancyapps/fancybox/dist/jquery.fancybox.css';
    import moment from 'moment';

    export default {
        props: {
            item: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                photo_index: 0,
                home_image: this.item.medium_image
            }
        },
        methods: {
            openFloorplan() {
                if (this.item.floorplan_link == null || this.item.floorplan_link === '') {
                    return;
                }
                $.fancybox.open({
                    src  : this.item.floorplan_link,
                    type : 'iframe',
                    buttons : ['fullScreen', 'close']
                });
            },
            openTour() {
                if (this.item.matterport == null || this.item.matterport === '') {
                    return;
                }
                $.fancybox.open({
                    src  : this.item.matterport,
                    type : 'iframe',
                    buttons : ['fullScreen', 'close']
                });
            },
            formatDate(date) {
                if (moment() > moment(date)) {
                    return 'Move In Ready!';
                } else {
                    return moment(date).format('MMMM');
                }
            },
            prevPhoto() {
                if (this.photo_index === 0) {
                    this.photo_index = this.item.gallery.length - 1;
                }
                this.photo_index--;
                this.home_image = this.item.gallery[this.photo_index].medium_image;
            },
            nextPhoto() {
                if (this.photo_index === (this.item.gallery.length -1)) {
                    this.photo_index = 0;
                }
                this.photo_index++;
                this.home_image = this.item.gallery[this.photo_index].medium_image;
            }
        }
    }
</script>

<style lang="scss">
    .item {
        cursor: pointer;

        .image-container {
            overflow: hidden;
            height: 27vh;
            position: relative;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .nav-left {
                position: absolute;
                border-radius: 0;
                left: 0;
                width: 8vh;
                top: 8vh;
                bottom: 8vh;
                height: 15vh;
                right: auto;
                justify-content: center;
                align-items: center;
                display: flex;
            }

            .nav-right {
                position: absolute;
                border-radius: 0;
                right: 0;
                width: 8vh;
                top: 8vh;
                bottom: 8vh;
                height: 15vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .specification{
                position: absolute;
                top: 2vh;
                left: 2vh;

                .img-container {
                    background: #144166;
                    padding: 1vh;

                    img {
                        width: 8vh;
                        height: auto;
                    }
                }
            }
        }

        .content {
            background: #efefef;
            padding: 1vh;
            border-left: 0.2vh solid #ddd;
            border-right: 0.2vh solid #ddd;
            border-bottom: 0.2vh solid #ddd;
            color: #000;

            h3 {
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
                height: 3vh;
                white-space: nowrap;
                margin-top: 1vh;
                font-weight: 600;
            }
        }

        .info-box {
            border-left: 0.2vh solid #ddd;
            border-right: 0.2vh solid #ddd;
            border-bottom: 0.2vh solid #ddd;
            background: #fff;

            .features {
                display: flex;
                justify-content: space-between;

                .feature {
                    display: flex;
                    align-items: center;
                    width: 33%;
                    padding: 1vh;
                    font-size: 1.5vh;
                    border-right: 0.2vh solid #ddd;
                    justify-content: center;

                    @media all and (max-width: 1050px) {
                        font-size: 1.2vh;
                    }

                    img {
                        margin-right: 1vh;
                    }

                    &:last-child {
                        border-right: 0;
                    }
                }
            }

            .details {
                border-top: 0.2vh solid #ddd;
                display: flex;
                justify-content: center;

                a {
                    display: block;
                    padding: 2vh 1vh;
                    font-weight: 600;
                    text-align: center;
                    flex-grow: 1;
                    text-decoration: none;
                    color: #0f7ae5;
                    font-size: 2vh;

                    @media all and (max-width: 1050px) {
                        font-size: 1.5vh;
                    }

                    &.disabled {
                        color: #9eaab6;
                    }
                }
            }
        }
    }
</style>