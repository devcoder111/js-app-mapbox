<template>
  <div
    class="quick_filters_wrapper"
    v-if="$mq != 'mobile'"
    v-click-outside="closeQuickFilter"
  >
    <div class="quick_filter_btn_wrapp">
      <a-button class="quickfiltersBtn" @click="toggleFilterBtn('communities')"
        >Communities <a-icon style="font-size: 11px" type="down"
      /></a-button>
      <div
        class="filter_btn_dropmenu"
        :class="{
          filterBtnActive:
            isactiveFilterBtn && currentFilterBtn == 'communities',
        }"
      >
        <a-checkbox-group
          @change="quickFilter"
          v-model="possessionFilters.communities"
        >
          <div v-for="area in areas" :key="area.name" style="padding: 5px 0">
            <p style="font-weight: 700">{{ area.name }}</p>
            <a-row>
              <a-col
                v-for="community in area.communities"
                :span="24"
                :key="community.id"
                ><a-checkbox :value="String(community.id)">{{
                  community.name
                }}</a-checkbox></a-col
              >
            </a-row>
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <div class="quick_filter_btn_wrapp" v-if="price_filter_visible">
      <a-button class="quickfiltersBtn" @click="toggleFilterBtn('price')"
        >Price <a-icon style="font-size: 11px" type="down"
      /></a-button>
      <div
        class="filter_btn_dropmenu"
        :class="{
          filterBtnActive: isactiveFilterBtn && currentFilterBtn == 'price',
        }"
      >
        <a-checkbox-group
          v-model="possessionFilters.price_range"
          @change="quickFilter"
        >
          <div>
            <a-checkbox style="width: 150px" value="0,350000"
              >$300K - $350K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="350000,400000"
              >$350K - $400K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="400000,450000"
              >$400K - $450K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="450000,500000"
              >$450K - $500K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="500000,550000"
              >$500K - $550K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="550000,600000"
              >$550K - $600K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="600000,650000"
              >$600K - $650K</a-checkbox
            >
          </div>
          <div>
            <a-checkbox style="width: 150px" value="650000,5000000"
              >$650K+</a-checkbox
            >
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <div class="quick_filter_btn_wrapp">
      <a-button class="quickfiltersBtn" @click="toggleFilterBtn('hometype')"
        >Home Type <a-icon style="font-size: 11px" type="down"
      /></a-button>
      <div
        class="filter_btn_dropmenu"
        :class="{
          filterBtnActive: isactiveFilterBtn && currentFilterBtn == 'hometype',
        }"
      >
        <a-checkbox-group
          v-model="possessionFilters.home_types"
          @change="quickFilter"
        >
          <div
            v-for="home_type_item of home_type_items"
            :key="home_type_item.label"
            style="width: 200px"
          >
            <a-checkbox :value="home_type_item.value"
              >{{ home_type_item.label }}
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <div class="quick_filter_btn_wrapp">
      <a-button class="quickfiltersBtn" @click="toggleFilterBtn('square')"
        >Square Footage <a-icon style="font-size: 11px" type="down"
      /></a-button>
      <div
        class="filter_btn_dropmenu"
        :class="{
          filterBtnActive: isactiveFilterBtn && currentFilterBtn == 'square',
        }"
      >
        <a-checkbox-group
          v-model="possessionFilters.home_size_range"
          @change="quickFilter"
        >
          <div>
            <a-checkbox value="1000,1250">1000 - 1250</a-checkbox>
          </div>
          <div>
            <a-checkbox value="1250,1500">1250 - 1500</a-checkbox>
          </div>
          <div>
            <a-checkbox value="1500,1750">1500 - 1750</a-checkbox>
          </div>
          <div>
            <a-checkbox value="1750,2000">1750 - 2000</a-checkbox>
          </div>
          <div>
            <a-checkbox value="2000,2250">2000 - 2250</a-checkbox>
          </div>
          <div>
            <a-checkbox value="2250,2500">2250 - 2500</a-checkbox>
          </div>
          <div>
            <a-checkbox value="2500,5000">2500+</a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <div class="quick_filter_btn_wrapp" v-if="possession_date_filter_visible">
      <a-button
        class="quickfiltersBtn"
        @click="toggleFilterBtn('possessiondate')"
        >Possession Date <a-icon style="font-size: 11px" type="down"
      /></a-button>
      <div
        class="filter_btn_dropmenu"
        :class="{
          filterBtnActive:
            isactiveFilterBtn && currentFilterBtn == 'possessiondate',
        }"
      >
        <a-checkbox-group
          v-model="possessionFilters.released_market"
          @change="quickFilter"
        >
          <div style="margin-bottom: 5px">
            <a-checkbox
              style="display: flex; align-items: center"
              value="move_in_ready"
            >
              <div style="display: inline-block; font-size: 13px">
                <div>Move-In Ready</div>
                <div style="font-size: 10px">Homes ready now</div>
              </div>
            </a-checkbox>
          </div>
          <div style="margin-bottom: 5px">
            <a-checkbox
              style="display: flex; align-items: center"
              value="quick_possession"
            >
              <div style="display: inline-block; font-size: 13px">
                <div>Quick Possession</div>
                <div style="font-size: 10px">Homes ready within 1-3 months</div>
              </div>
            </a-checkbox>
          </div>
          <div>
            <a-checkbox
              style="display: flex; align-items: center"
              value="under_construction"
            >
              <div style="display: inline-block; font-size: 13px">
                <div>Under Construction</div>
                <div style="font-size: 10px">Homes ready within 4+ months</div>
              </div>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
    </div>
    <div class="quick_filter_btn_wrapp">
      <a-button class="quickfiltersBtn" @click="clearAllFilters()"
        >Clear All</a-button
      >
    </div>
  </div>
</template>

<script type="text/javascript">
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";
import map from "lodash/map";
import Icon from "ant-design-vue/lib/icon";
import { bus } from "../app.js";
import intersection from "lodash/intersection";

export default {
  components: {
    "a-button": Button,
    "a-icon": Icon,
  },
  data() {
    return {
      isactiveFilterBtn: false,
      currentFilterBtn: "",
      price_filter_visible: true,
      possession_date_filter_visible: true,
      communities: [],
      areas: {
        "north-east": {
          id: "north-east",
          name: "North East",
          communities: {},
        },
        "north-west": {
          id: "north-west",
          name: "North West",
          communities: {},
        },
        "south-west": {
          id: "south-west",
          name: "South West",
          communities: {},
        },
        "south-east": {
          id: "south-east",
          name: "South East",
          communities: {},
        },
        "fort-saskatchewan": {
          id: "fort-saskatchewan",
          name: "Fort Saskatchewan",
          communities: {},
        },
        "sherwood-park": {
          id: "sherwood-park",
          name: "Sherwood Park",
          communities: {},
        },
        "spruce-grove": {
          id: "spruce-grove",
          name: "Spruce Grove",
          communities: {},
        },
        "stony-plain": {
          id: "stony-plain",
          name: "Stony Plain",
          communities: {},
        },
        beaumont: {
          id: "beaumont",
          name: "Beaumont",
          communities: {},
        },
      },
      home_type_items: [
        { label: "Duplex Homes", value: "duplex" },
        { label: "Laned Homes", value: "laned" },
        { label: "Front Attached Home", value: "sterling" },
      ],
      filter: {
        key: null,
        type: null,
        communities: [],
        price_range: [],
        released_market: [],
        beds: 0,
        baths: 0,
        possession_date: null,
        home_size_range: [],
        home_types: [],
        model_ids: [],
        features: [],
        front_exposure: [],
        garage_parking_spaces: [],
        lot_size: 0,
        lot_shape: "",
        lot_location: "",
        walkout_lot: "",
        colourboard: "",
        is_price_reduced: false,
        is_promotion: false,
        is_guaranted: 0,
        isFourPlusBeds: false,
        isUnder400: false,
        isUnder500: false,
        isLegalSuite: false,
      },
    };
  },
  mounted() {
    switch (this.$route.name) {
      case "listing":
      case "quick-possessions":
        this.price_filter_visible = true;
        this.possession_date_filter_visible = true;

        break;
      case "home-designs":
        this.price_filter_visible = false;
        this.possession_date_filter_visible = false;
        break;
      case "show-homes":
        this.price_filter_visible = false;
        this.possession_date_filter_visible = false;

        break;
    }
  },
  created() {
    bus.$on("communities", (communities) => {
      this.communities = communities;
      communities.forEach((community) => {
        this.areas[community.area].communities[community.id] = community;
      });
      console.log("communities--", this.communities, this.areas);
    });
  },

  computed: {
    possessionFilters: {
      get() {
        console.log("possessionFilters");
        return this.$store.state.filter;
      },
    },
  },
  methods: {
    closeQuickFilter() {
      console.log("closeQuickFilter", "");
      this.isactiveFilterBtn = false;
    },
    clearAllFilters() {
      bus.$emit("clearAllFilters");
    },
    toggleFilterBtn(currentBtn) {
      if (this.currentFilterBtn == currentBtn)
        this.isactiveFilterBtn = !this.isactiveFilterBtn;
      else this.isactiveFilterBtn = true;
      this.currentFilterBtn = currentBtn;
    },
    refresh(save = true) {
      console.log("quick filter refresh-", this.filter, this.$route.name);
      this.filter.key = this.filterKey;
      this.filter.type = this.$route.name;
      if (save) {
        this.$store
          .dispatch("saveFilter", {
            routeName: this.$route.name,
            filter: this.filter,
          })
          .then(() => {
            this.$emit("onRefresh");
          });
      } else {
        this.$emit("onRefresh");
      }
    },
    quickFilter() {
      // this.$refs.resultContainer.refresh();
      // this.$emit("onRefresh");
    },
    onChange(checkedValues) {
      let $this = this;
      Object.values(this.areas).forEach((area) => {
        let communityIds = Object.keys(area.communities).map((key) => {
          return parseInt(key);
        });
        let isAreaSelected =
          intersection(checkedValues, communityIds).length ===
          communityIds.length;
        let selectedAreaIndex = checkedValues.indexOf(area.id);
        if (isAreaSelected) {
          if (selectedAreaIndex === -1) {
            $this.filter.communities.push(area.id);
          }
        } else {
          if (selectedAreaIndex > -1) {
            $this.filter.communities.splice(selectedAreaIndex, 1);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-filter-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  padding: 3px 0;
  align-items: center;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
}

.main-container .filter-container {
  display: none;
}
@media all and (max-width: 500px) {
  .search-filter-wrapper {
    display: flex !important;
  }
}
</style>
