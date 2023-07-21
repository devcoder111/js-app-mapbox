<template>
  <div class="filter-container">
    <div class="filter-items">
      <a-collapse accordion @change="activePanelChanged">
        <a-collapse-panel
          header="Community"
          v-if="$parent.community_filter_visible"
        >
          <a-checkbox-group @change="onChange" v-model="filter.communities">
            <div v-for="area in areas" :key="area.id" style="padding: 20px 0">
              <strong
                style="
                  font-size: 15px;
                  display: block;
                  padding-bottom: 5px;
                  border-bottom: 1px solid #ddd;
                  margin-bottom: 10px;
                "
                ><a-checkbox :value="area.id" @change="onChangeArea">{{
                  area.name
                }}</a-checkbox></strong
              >
              <a-row>
                <a-col
                  v-for="community in area.communities"
                  :span="24"
                  :key="community.id"
                  ><a-checkbox :value="community.id">{{
                    community.name
                  }}</a-checkbox></a-col
                >
              </a-row>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>
        <a-collapse-panel
          header="Price"
          v-if="$parent.price_filter_visible"
          key="price"
        >
          <a-radio-group v-model="filter.price_range">
            <a-radio style="width: 150px" value="0,1000">Price</a-radio>
            <a-radio style="width: 150px" value="250,300"
              >$250K - $300K</a-radio
            >
            <a-radio style="width: 150px" value="300,350"
              >$300K - $350K</a-radio
            >
            <a-radio style="width: 150px" value="350,400"
              >$350K - $400K</a-radio
            >
            <a-radio style="width: 150px" value="400,450"
              >$400K - $450K</a-radio
            >
            <a-radio style="width: 150px" value="450,500"
              >$450K - $500K</a-radio
            >
            <a-radio style="width: 150px" value="500,1000">$500K+</a-radio>
          </a-radio-group>
        </a-collapse-panel>
        <a-collapse-panel
          header="Beds & Baths"
          v-if="$parent.beds_baths_filter_visible"
        >
          <h4>Beds</h4>
          <a-radio-group :options="bed_items" v-model="filter.beds" />
          <h4 style="margin-top: 20px">Baths</h4>
          <a-radio-group :options="bath_items" v-model="filter.baths" />
        </a-collapse-panel>
        <a-collapse-panel
          header="Possession Date"
          v-if="$parent.possession_date_filter_visible"
        >
          <a-checkbox-group v-model="filter.released_market">
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
                  <div style="font-size: 10px">
                    Homes ready within 1-3 months
                  </div>
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
                  <div style="font-size: 10px">
                    Homes ready within 4+ months
                  </div>
                </div>
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>
        <a-collapse-panel
          header="Square Feet"
          v-if="$parent.home_size_filter_visible"
        >
          <a-checkbox-group v-model="filter.home_size_range">
            <a-row>
              <a-checkbox value="1000,1250">1000 - 1250</a-checkbox>
              <a-checkbox value="1250,1500">1250 - 1500</a-checkbox>
              <a-checkbox value="1500,1750">1500 - 1750</a-checkbox>
            </a-row>
            <a-row>
              <a-checkbox value="1750,2000">1750 - 2000</a-checkbox>
              <a-checkbox value="2000,2250">2000 - 2250</a-checkbox>
              <a-checkbox value="2250,2500">2250 - 2500</a-checkbox>
            </a-row>
            <a-checkbox value="2500,5000">2500+</a-checkbox>
          </a-checkbox-group>
        </a-collapse-panel>
        <a-collapse-panel
          header="Home Types"
          v-if="$parent.home_type_filter_visible"
        >
          <a-checkbox-group
            :options="home_type_items"
            v-model="filter.home_types"
          />
        </a-collapse-panel>
        <a-collapse-panel
          header="Models"
          v-if="
            $parent.home_type_filter_visible && $route.name !== 'home-designs'
          "
        >
          <a-checkbox-group v-model="filter.model_ids">
            <div
              style="
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                width: 400px;
              "
            >
              <div v-for="model of models" :key="model.id" style="width: 200px">
                <a-checkbox
                  :value="model.id"
                  :checked="filter.model_ids.indexOf(model.id) > -1"
                  >{{ model.title }}</a-checkbox
                >
              </div>
            </div>
          </a-checkbox-group>
        </a-collapse-panel>
        <a-collapse-panel header="Included or optional build features">
          <a-checkbox-group v-model="filter.features">
            <a-row>
              <a-col
                v-for="feature in feature_items"
                :span="24"
                :key="feature.value"
              >
                <a-checkbox :value="feature.value">{{
                  feature.label
                }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="button-container">
      <a-button
        size="small"
        class="save-button"
        :disabled="isDefault || isSavedFilter"
        @click.prevent="saveFilters"
        ><a-icon type="save" /> Save</a-button
      >
      <a-button
        size="small"
        class="clear-button"
        :disabled="isDefault"
        @click.prevent="clearAll"
        ><a-icon type="delete" /> Clear</a-button
      >
      <a-button type="primary" @click.prevent="apply">Apply</a-button>
    </div>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy";
import md5 from "crypto-js/md5";
import moment from "moment";
import Select from "ant-design-vue/lib/select";
import Collapse from "ant-design-vue/lib/collapse";
import CollapsePanel from "ant-design-vue/lib/collapse/CollapsePanel";
import Modal from "ant-design-vue/lib/modal";
import Icon from "ant-design-vue/lib/icon";
import Button from "ant-design-vue/lib/button";
import Slider from "ant-design-vue/lib/slider";
import RadioGroup from "ant-design-vue/lib/radio/Group";
import Radio from "ant-design-vue/lib/radio";
import DatePicker from "ant-design-vue/lib/date-picker";
import CheckboxGroup from "ant-design-vue/lib/checkbox/Group";
import Checkbox from "ant-design-vue/lib/checkbox";
import Row from "ant-design-vue/lib/row";
import Column from "ant-design-vue/lib/col";
import "ant-design-vue/lib/checkbox/style/css";
import "ant-design-vue/lib/row/style/css";
import "ant-design-vue/lib/col/style/css";
import "ant-design-vue/lib/collapse/style/css";
import "ant-design-vue/lib/select/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/slider/style/css";
import "ant-design-vue/lib/radio/style/css";
import "ant-design-vue/lib/date-picker/style/css";
import axios from "axios";

export default {
  components: {
    "a-icon": Icon,
    "a-button": Button,
    "a-modal": Modal,
    "a-collapse": Collapse,
    "a-collapse-panel": CollapsePanel,
    "a-select": Select,
    "a-select-option": Select.Option,
    "a-slider": Slider,
    "a-radio-group": RadioGroup,
    "a-radio": Radio,
    "a-date-picker": DatePicker,
    "a-checkbox-group": CheckboxGroup,
    "a-checkbox": Checkbox,
    "a-row": Row,
    "a-col": Column,
  },
  props: {
    disableFloatingButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active_panel_key: 0,
      modal_visible: false,
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
        // "west-edmonton": {
        //   id: "west-edmonton",
        //   name: "West Edmonton",
        //   communities: {},
        // },
      },
      bed_items: [
        { label: "0+", value: 0 },
        { label: "1+", value: 1 },
        { label: "2+", value: 2 },
        { label: "3+", value: 3 },
        { label: "4+", value: 4 },
        { label: "5+", value: 5 },
        { label: "6+", value: 6 },
      ],
      bath_items: [
        { label: "0+", value: 0 },
        { label: "1+", value: 1 },
        { label: "2+", value: 2 },
        { label: "3+", value: 3 },
        { label: "4+", value: 4 },
        { label: "5+", value: 5 },
        { label: "6+", value: 6 },
      ],
      home_type_items: [
        { label: "Townhomes", value: "townhome" },
        { label: "Duplex Homes", value: "duplex" },
        { label: "Laned Homes", value: "laned" },
        { label: "Front Attached Home", value: "sterling" },
      ],
      feature_items: [
        { label: "Seperate Entrance", value: "seperate_entrance" },
        { label: "4 Bedroom Option", value: "four_bedrooms" },
        { label: "5 Bedroom Option", value: "five_bedrooms" },
        { label: "Bonus Room", value: "bonus_room" },
        { label: "Upstairs Laundry", value: "upstairs_laundry" },
        { label: "Legal Suite", value: "legal_suite" },
        { label: "Den / Flex Room", value: "flex_room" },
        { label: "3 Piece Ensuite", value: "three_ensuite" },
        { label: "4 Piece Ensuite", value: "four_ensuite" },
        { label: "5 Piece Ensuite", value: "five_ensuite" },
        { label: "Walkout Basement", value: "walkout" },
        { label: "Evolve", value: "evolve" },
      ],
      filter: {
        communities: [],
        price_range: "0,1000",
        released_market: [],
        beds: 0,
        baths: 0,
        possession_date: null,
        home_size_range: [],
        home_types: [],
        model_ids: [],
        features: [],
      },
      models: [],
      scrollEventFunction: null,
    };
  },
  computed: {
    filterKey() {
      let key =
        this.filter.price_range +
        "_" +
        sortBy(this.filter.communities).join("_") +
        "_" +
        sortBy(this.filter.released_market).join("_") +
        "_" +
        this.filter.beds +
        "_" +
        this.filter.baths +
        "_" +
        (this.filter.possession_date != null
          ? this.filter.possession_date.format().substring(0, 10)
          : null) +
        "_" +
        this.filter.home_size_range +
        "_" +
        sortBy(this.filter.home_types).join("_") +
        "_" +
        sortBy(this.filter.model_ids).join("_") +
        "_" +
        sortBy(this.filter.features).join("_");
      return this.$route.name + md5(key).toString();
    },
    isDefault() {
      return this.$store.state.default_filter_keys.indexOf(this.filterKey) > -1;
    },
    isSavedFilter() {
      return this.$store.state.saved_filters.hasOwnProperty(this.filterKey);
    },
  },
  mounted() {
    let $this = this;
    this.scrollEventFunction = function () {
      if ($this.disableFloatingButton === false) {
        let doc = document.documentElement;
        if (doc.scrollTop > 100) {
          $(".floating-action-button").show();
        } else {
          $(".floating-action-button").hide();
        }
      }
    };
    window.addEventListener("scroll", this.scrollEventFunction, false);
    this.scrollEventFunction();
    axios.get("/wp-json/templatev2/v1/communities").then((response) => {
      response.data.forEach((community) => {
        $this.areas[community.area].communities[community.id] = community;
      });
    });
    axios.get("/wp-json/templatev2/v1/models").then((response) => {
      $this.models = response.data;
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollEventFunction);
  },
  methods: {
    showModal() {
      this.filter.communities = [];
      this.$parent.filter.communities.forEach((id) => {
        this.filter.communities.push(id);
      });
      this.filter.price_range = this.$parent.filter.price_range.join(",");
      this.filter.beds = this.$parent.filter.beds;
      this.filter.baths = this.$parent.filter.baths;
      this.filter.possession_date =
        this.$parent.filter.possession_date != null
          ? moment(this.$parent.filter.possession_date)
          : null;
      this.filter.home_size_range =
        this.$parent.filter.home_size_range.join(",");
      this.filter.home_types = this.$parent.filter.home_types;
      this.filter.model_ids = this.$parent.filter.model_ids;
      this.filter.features = this.$parent.filter.features;
      this.modal_visible = true;
    },
    saveFilters() {
      this.$parent.saveFilters();
      this.apply();
    },
    clearAll() {
      this.modal_visible = false;
      this.$parent.clearAll();
    },
    apply() {
      this.modal_visible = false;
      this.$parent.filter.communities = this.filter.communities;
      this.$parent.filter.price_range = this.filter.price_range.split(",");
      this.$parent.filter.beds = this.filter.beds;
      this.$parent.filter.baths = this.filter.baths;
      this.$parent.filter.possession_date =
        this.filter.possession_date != null
          ? this.filter.possession_date.format()
          : null;
      this.$parent.filter.home_size_range =
        this.filter.home_size_range.split(",");
      this.$parent.filter.home_types = this.filter.home_types;
      this.$parent.filter.model_ids = this.filter.model_ids;
      this.$parent.filter.features = this.filter.features;
      this.$parent.refresh();
    },
    disabledDate(date) {
      return moment() > date;
    },
    activePanelChanged(key) {
      this.active_panel_key = key;
    },
    onChangeArea(e) {
      let $this = this;
      let area = this.areas[e.target.value];
      Object.values(area.communities).forEach((community) => {
        let index = $this.filter.communities.indexOf(community.id);
        if (e.target.checked) {
          if (index === -1) {
            $this.filter.communities.push(community.id);
          }
        } else {
          if (index > -1) {
            $this.filter.communities.splice(index, 1);
          }
        }
      });
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

<style lang="scss" scoped></style>
