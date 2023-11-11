<template>
  <div class="item" :id="'home-box-' + item.id">
    <div class="image-container">
      <img
        :src="home_image"
        :class="is_sold && is_conditional === false ? 'cover bg-grey' : 'cover'"
        @click.self="openGallery(item)"
        @contextmenu.prevent="$refs.menu.open"
      />
      <a-button
        class="nav-left"
        v-if="item.gallery.length > 0"
        size="small"
        type="link"
        @click="prevPhoto()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-md"
          width="35"
          height="35"
          stroke-width="3"
          stroke="#fff"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <polyline points="15 6 9 12 15 18"></polyline>
        </svg>
      </a-button>
      <a-button
        class="nav-right"
        v-if="item.gallery.length > 0"
        size="small"
        type="link"
        @click="nextPhoto()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-md"
          width="35"
          height="35"
          stroke-width="3"
          stroke="#fff"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z"></path>
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </a-button>

      <!-- <div class="sale-ribbon" v-if="item.promotion_checkbox === true">
        <img src="../assets/sale_badge.png" />
      </div> -->
      <div
        class="corner-ribbon top-left sticky red shadow"
        v-if="is_sold && is_conditional === false"
      >
        SOLD
      </div>
      <div class="bottom-ribbon" v-if="is_conditional">I'M RESERVED</div>
    </div>
    <div class="item-contents" @click="openPreview(item)">
      <div
        v-if="item.possession_date_banner != null"
        :class="
          item.possession_date_banner == 'Move-In Ready'
            ? 'home-status hide-mobile bg-blue'
            : item.possession_date_banner == 'Quick Possession'
            ? 'home-status hide-mobile bg-sky'
            : 'home-status hide-mobile bg-light-grey'
        "
      >
        <span style="text-transform: uppercase">{{
          item.possession_date_banner
        }}</span>
      </div>
      <div class="info-box">
        <div class="features">
          <div class="feature">
            <img src="../assets/home.png" alt="" width="18px" />
            {{ item.sq_ft }} sqft
          </div>
          <div class="feature">
            <img src="../assets/bed.png" alt="" width="18px" />
            {{ item.bedrooms }}
            <span
              v-if="item.bedrooms_max > 0 && item.bedrooms_max > item.bedrooms"
              >&nbsp;- {{ item.bedrooms_max }}</span
            >
          </div>
          <div class="feature">
            <img src="../assets/bath.png" alt="" width="18px" />
            {{ item.bathrooms }}
          </div>
        </div>
      </div>
      <div class="content">
        <h3 v-html="item.title"></h3>
        <h4
          v-if="$route.name == 'home-designs'"
          class="home-style"
          v-html="item.features.home_style"
        ></h4>
        <div class="address" v-if="address_visible">
          {{ item.street }}, {{ item.community_name }}
        </div>
        <div v-if="move_in_date_visible && item.guaranted_date != ''">
          <strong>Availability: </strong
          ><span>
            {{ formatDate(item.guaranted_date) }}
          </span>
        </div>
        <div v-if="move_in_date_visible && item.guaranted_date == ''">
          <strong>Availability: </strong
          ><span>
            {{ formatOnlyDate(item.completion_date) }} -
            {{ formatOnlyDate(item.end_completion_date.date) }}
          </span>
        </div>
        <div v-if="item.build_start">
          <a-popover placement="left">
            <template slot="content">
              <p>Build times generally range from 8-11 months, on average</p>
            </template>
            <strong style="font-size: 11px"
              ><a-icon type="question-circle" /> Anticipated Build
              Start:</strong
            >
            {{ formatDate(item.possession_date) }}
          </a-popover>
        </div>
      </div>
      <div class="details">
        <div class="price" v-if="price_visible">
          <div v-if="item.original_price != ''" class="red-text">
            NOW: ${{ formatMoney(home_price) }}
          </div>
          <div v-else>${{ formatMoney(home_price) }}</div>

          <div v-if="item.original_price != ''">
            <span class="original-price">
              ${{ formatMoney(item.original_price) }}
            </span>
            <span class="reduced_price"
              >${{ formatMoney(reduced_price) }} OFF</span
            >
          </div>
          <!-- <div
            class="home-price"
            v-if="
              (item.offer_status == '' || item.offer_status == 'Pending') &&
              item.newstar_price == 0
            "
          >
            RESERVED
          </div>
          <div
            class="home-price"
            v-else-if="item.offer_status == 'Conditional'"
          >
            PENDING
          </div>
          <div class="home-price" v-else-if="item.offer_status == 'Sold'">
            SALE
          </div> -->
        </div>
        <div
          @click.stop="goPossessionPage(item.link)"
          :class="
            item.possession_date_banner == 'Move-In Ready' ||
            item.open_hour == ''
              ? 'see-details-btn bg-blue'
              : item.possession_date_banner == 'Quick Possession'
              ? 'see-details-btn bg-sky'
              : 'see-details-btn bg-light-grey'
          "
        >
          <span>VIEW DETAILS</span>
        </div>
      </div>
      <div class="second-features" v-if="$route.name !== 'home-designs'">
        <div class="second-feature" v-if="item.features.legal_suite == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Legal Suite
        </div>
        <div
          class="second-feature"
          v-if="item.features.finished_basement == '1'"
        >
          <a-icon type="check" style="color: #5dadff"></a-icon>Finished Basement
        </div>
        <div class="second-feature" v-if="item.features.garden_suite == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Garden Suite
        </div>
        <div
          class="second-feature"
          v-if="item.features.previous_show_home == '1'"
        >
          <a-icon type="check" style="color: #5dadff"></a-icon>Previous Show
          Home
        </div>
        <div class="second-feature" v-if="item.features.spice_kitchen == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Spice Kitchen
        </div>
        <div class="second-feature" v-if="item.features.walkout == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Walkout Basement
        </div>
        <div class="second-feature" v-if="item.features.open_below == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Open to Below
        </div>
        <div
          class="second-feature"
          v-if="item.features.seperate_entrance == '1'"
        >
          <a-icon type="check" style="color: #5dadff"></a-icon>Side Entrace
        </div>
        <div class="second-feature" v-if="item.features.main_bedroom == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Main Floor
          Bedroom
        </div>
        <div class="second-feature" v-if="item.features.four_bedrooms == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>4th Bedroom
        </div>
        <div class="second-feature" v-if="item.features.five_bedrooms == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>5th Bedroom
        </div>
        <div class="second-feature" v-if="item.features.nine_foot_main == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>9 Foot Main Floor
        </div>
        <div
          class="second-feature"
          v-if="item.features.nine_foot_basement == '1'"
        >
          <a-icon type="check" style="color: #5dadff"></a-icon>9 Foot Basement
        </div>
        <div class="second-feature" v-if="item.features.five_ensuite == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>5-Piece Ensuite
        </div>
        <div class="second-feature" v-if="item.features.four_ensuite == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>4-Piece Ensuite
        </div>
        <div class="second-feature" v-if="item.features.three_ensuite == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>3-Piece Ensuite
        </div>
        <div class="second-feature" v-if="item.features.flex_room == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Den
        </div>
        <div class="second-feature" v-if="item.features.bonus_room == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Bonus Room
        </div>
        <div class="second-feature" v-if="item.features.side_windows == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Side Windows
        </div>
        <div class="second-feature" v-if="item.features.landscaping == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Landscaping
        </div>
        <div class="second-feature" v-if="item.features.mudroom == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Mudroom
        </div>
        <div
          class="second-feature"
          v-if="item.features.upstairs_laundry == '1'"
        >
          <a-icon type="check" style="color: #5dadff"></a-icon>Upstairs Laundry
        </div>
        <div class="second-feature" v-if="item.features.railings == '1'">
          <a-icon type="check" style="color: #5dadff"></a-icon>Railings
        </div>
      </div>
      <div class="full-details" v-if="$route.name !== 'home-designs'">
        <div>
          <span v-if="!showPreview">Preview</span>
          <span v-if="showPreview">Close</span>
          <a-icon
            style="font-size: 11px"
            :type="showPreview ? 'up' : 'down'"
          ></a-icon>
        </div>
      </div>
    </div>
    <div class="preview-contents" v-show="showPreview">
      <a-row :gutter="16">
        <a-col :span="8">
          <div>Highlights of this home:</div>
          <div v-if="item.features.mudroom == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Mudroom
          </div>
          <div v-if="item.features.flex_room == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Den
          </div>
          <div v-if="item.features.spice_kitchen == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Spice Kitchen
          </div>
          <div v-if="item.features.bonus_room == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Bonus Room
          </div>
          <div v-if="item.features.upstairs_laundry == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Upstairs
            Laundry
          </div>
          <div v-if="item.features.main_bedroom == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Main Floor
            Bedroom
          </div>
          <div v-if="item.features.four_bedrooms == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>4th Bedroom
          </div>
          <div v-if="item.features.five_bedrooms == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>5th Bedroom
          </div>
          <div v-if="item.features.three_ensuite == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>3-Piece Ensuite
          </div>
          <div v-if="item.features.four_ensuite == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>4-Piece Ensuite
          </div>
          <div v-if="item.features.five_ensuite == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>5-Piece Ensuite
          </div>
          <div v-if="item.features.seperate_entrance == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Side Entrace
          </div>
          <div v-if="item.features.legal_suite == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Legal Suite
          </div>
          <div v-if="item.features.walkout == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Walkout
            Basement
          </div>
          <div v-if="item.features.open_below == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Open to Below
          </div>
          <div v-if="item.features.railings == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Railings
          </div>
          <div v-if="item.features.nine_foot_main == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>9 Foot Main
            Floor
          </div>
          <div v-if="item.features.nine_foot_basement == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>9 Foot Basement
          </div>
          <div v-if="item.features.side_windows == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Side Windows
          </div>
          <div v-if="item.features.previous_show_home == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Previous Show
            Home
          </div>
          <div v-if="item.features.landscaping == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Landscaping
          </div>
          <div v-if="item.features.finished_basement == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Finished
            Basement
          </div>
          <div v-if="item.features.kitchen_package == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Luxury Kitchen
            Package
          </div>
          <div v-if="item.features.garage_package == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Luxury Garage
            Package
          </div>
          <div v-if="item.features.rough_ins == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Basement
            Rough-Ins Package
          </div>
          <div v-if="item.features.stand_shower == '1'">
            <a-icon type="check" style="color: #5dadff"></a-icon>Stand up shower
          </div>
        </a-col>
        <a-col :span="16">
          <div>
            Located in <b>{{ item.community_name }} Community</b>
          </div>
          <div>What locals say:</div>
          <div v-if="item.locals_say.pet_friendly == ''" class="truncateStr">
            {{ item.intro }}
          </div>
          <a-row v-else :gutter="8" style="display: flex; flex-wrap: wrap">
            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/paw.png"
                  />
                  it's dog friendly
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.pet_friendly }}%</span>
                </p>
              </div>
            </a-col>

            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/night.png"
                  />
                  Can walk alone at night
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.walk_alone }}%</span>
                </p>
              </div>
            </a-col>
            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/light_night.png"
                  />
                  Low crime rate
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.low_crime }}%</span>
                </p>
              </div>
            </a-col>

            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/street-light.png"
                  />
                  Streets are well-lit
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.street_well_lit }}%</span>
                </p>
              </div>
            </a-col>

            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/chat.png"
                  />
                  Neighbors are friendly
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.neighbours_friendly }}%</span>
                </p>
              </div>
            </a-col>

            <a-col
              :xs="{ span: 24 }"
              :lg="{ span: 12 }"
              class="locals-say-item-wrapper"
            >
              <div class="locals-say-item">
                <p class="item-desc">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/slider.png"
                  />
                  Kids play outside
                </p>
                <p class="item-percent">
                  <img
                    src="https://www.sterlingedmonton.com/wp-content/uploads/thumb3.png"
                  /><span>{{ item.locals_say.kids_outside }}%</span>
                </p>
              </div>
            </a-col>
          </a-row>
          <div style="display: flex; justify-content: end">
            <a-button class="full-details-btn" @click="openHome(item.link)"
              >SEE FULL DETAILS</a-button
            >
          </div>
        </a-col>
      </a-row>
    </div>
    <div
      v-if="item.possession_date_banner != null"
      :class="
        item.possession_date_banner == 'Move-In Ready'
          ? 'home-status hide-desktop bg-blue'
          : item.possession_date_banner == 'Quick Possession'
          ? 'home-status hide-desktop bg-sky'
          : 'home-status hide-desktop bg-light-grey'
      "
    >
      <span style="text-transform: uppercase">{{
        item.possession_date_banner
      }}</span>
    </div>

    <vue-context ref="menu">
      <li><a @click="openInNewTab()">Open Link in New Tab</a></li>
    </vue-context>
  </div>
</template>

<script>
import moment from "moment";
import { VueContext } from "vue-context";
import { mapState, mapActions } from "vuex";
import Button from "ant-design-vue/lib/button";
import Icon from "ant-design-vue/lib/icon";
import Popover from "ant-design-vue/lib/popover";
import "ant-design-vue/lib/popover/style/index.css";
import { bus } from "../app.js";

export default {
  components: {
    "a-button": Button,
    "a-icon": Icon,
    "vue-context": VueContext,
    "a-popover": Popover,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    let moneyFormatter = new Intl.NumberFormat("en-US", {
      currency: "USD",
      minimumFractionDigits: 0,
    });
    return {
      showPreview: false,
      moneyFormatter: moneyFormatter,
      photo_index: 0,
      home_image: this.item.medium_image,
      home_price: 0,
      reduced_price: 0,
    };
  },
  computed: {
    ...mapState(["favorites"]),
    is_favorited() {
      return this.favorites.hasOwnProperty(this.item.id);
    },
    price_visible() {
      if (this.is_sold || this.is_conditional) {
        return false;
      }
      return (
        ["quick-possessions", "coming-soon"].indexOf(this.$route.name) > -1
      );
    },
    address_visible() {
      return this.$route.name !== "home-designs";
    },
    move_in_date_visible() {
      return this.$route.name === "quick-possessions";
    },
    is_coming_soon() {
      return this.$route.name === "coming-soon";
    },
    show_quick_possession_title() {
      if (this.item.possession_date != null) {
        let date = moment(this.item.possession_date);
        return date.diff(moment(), "months") <= 3;
      } else {
        return false;
      }
    },
    is_sold() {
      return (
        this.item.sold ||
        (this.item.offer_status && this.item.offer_status === "Sold")
      );
    },
    is_conditional() {
      return (
        this.item.offer_status &&
        (this.item.offer_status === "Conditional" ||
          this.item.offer_status === "Pending")
      );
    },
  },
  created() {
    if (this.item.starting_from > 0) {
      this.home_price = this.item.starting_from;
    } else if (this.item.starting_from == 0 && this.item.newstar_price > 0)
      this.home_price = this.item.newstar_price;
    if (this.item.original_price != "")
      this.reduced_price =
        parseInt(this.item.original_price) - parseInt(this.home_price);
  },
  methods: {
    ...mapActions(["toggleFavorite"]),
    homeItemhover() {
      bus.$emit("homeItemhover", this.item.id);
    },
    openPreview(item) {
      if (this.$route.name !== "home-designs") {
        this.showPreview = !this.showPreview;
        bus.$emit("openMarker", item);
      }
    },
    goPossessionPage(link) {
      document.location.href = link;
      bus.$emit("goPossessionPage");
    },
    openInNewTab() {
      window.open(this.item.link, "_blank");
    },
    openGallery(item) {
      this.$emit("openGallery", item);
    },
    openHome(item) {
      document.location.href = this.item.link;
    },
    formatMoney(price) {
      return this.moneyFormatter.format(price);
    },
    formatDate(date) {
      // if (moment() > moment(date)) {
      if (moment(date).diff(moment(), "days") <= 30) {
        // return moment(date).diff(moment(), "days");
        return "Move In Ready!";
      } else {
        return moment(date).format("MMMM, YYYY");
      }
    },
    formatOnlyDate(date) {
      return moment(date).format("MMMM, YYYY");
    },
    prevPhoto() {
      if (this.photo_index === 0) {
        this.photo_index = this.item.gallery.length - 1;
      }
      this.photo_index--;
      this.home_image = this.item.gallery[this.photo_index].medium_image;
    },
    nextPhoto() {
      if (this.photo_index === this.item.gallery.length - 1) {
        this.photo_index = 0;
      }
      this.photo_index++;
      this.home_image = this.item.gallery[this.photo_index].medium_image;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vue-context/src/sass/vue-context";
</style>
