<template>
  <div class="page">
    <div class="banner_wrapper" :hidden="isMobile && mode == 'map'">
      <img src="../assets/banner.png" alt="Banner" class="banner_img" />
      <h2 class="banner_title">Quick Possessions</h2>
      <quick-filter @onRefresh="onRefresh" />
    </div>
    <div class="main-container">
      <!-- <filter-container @onRefresh="onRefresh" /> -->
      <result-container
        ref="resultContainer"
        @onLoading="onLoading"
        @onLoaded="onLoaded"
        @onResult="onResult"
        @onRefresh="onRefresh"
        v-show="!isMobile || (isMobile && mode == 'list')"
      />
      <map-container
        ref="mapContainer"
        @onVisibleItems="onVisibleItems"
        @onRefresh="onRefresh"
        :loading="loading"
        v-show="!isMobile || (isMobile && mode == 'map')"
      />
      <!-- <map-container ref="mapContainer" @onRefresh="onRefresh" /> -->
    </div>
    <div class="mobile-footer-buttons">
      <div
        :class="mode == 'list' ? 'map-view-btn' : 'map-view-btn active'"
        @click="toggleMap"
      >
        <svg
          width="10"
          height="16"
          viewBox="0 0 10 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 0C2.2 0 0 2.2 0 5C0 7.8 4 16 5 16C6 16 10 7.8 10 5C10 2.2 7.8 0 5 0ZM5 8C3.3 8 2 6.7 2 5C2 3.3 3.3 2 5 2C6.7 2 8 3.3 8 5C8 6.7 6.7 8 5 8Z"
            fill="#9F9F9F"
          />
        </svg>
        <span style="padding-left: 5px">Map View</span>
      </div>
      <div
        :class="mode == 'map' ? 'list-view-btn' : 'list-view-btn active'"
        @click="toggleMap"
      >
        <svg
          width="15"
          height="10"
          viewBox="0 0 15 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.833333 1.66667C1.29357 1.66667 1.66667 1.29357 1.66667 0.833333C1.66667 0.373096 1.29357 0 0.833333 0C0.373096 0 0 0.373096 0 0.833333C0 1.29357 0.373096 1.66667 0.833333 1.66667Z"
            fill="#9F9F9F"
          />
          <path
            d="M0.833333 5.83329C1.29357 5.83329 1.66667 5.4602 1.66667 4.99996C1.66667 4.53972 1.29357 4.16663 0.833333 4.16663C0.373096 4.16663 0 4.53972 0 4.99996C0 5.4602 0.373096 5.83329 0.833333 5.83329Z"
            fill="#9F9F9F"
          />
          <path
            d="M0.833333 10C1.29357 10 1.66667 9.62694 1.66667 9.16671C1.66667 8.70647 1.29357 8.33337 0.833333 8.33337C0.373096 8.33337 0 8.70647 0 9.16671C0 9.62694 0.373096 10 0.833333 10Z"
            fill="#9F9F9F"
          />
          <path
            d="M14.2166 4.16663H4.11659C3.68396 4.16663 3.33325 4.51734 3.33325 4.94996V5.04996C3.33325 5.48258 3.68396 5.83329 4.11659 5.83329H14.2166C14.6492 5.83329 14.9999 5.48258 14.9999 5.04996V4.94996C14.9999 4.51734 14.6492 4.16663 14.2166 4.16663Z"
            fill="#9F9F9F"
          />
          <path
            d="M14.2166 8.33337H4.11659C3.68396 8.33337 3.33325 8.68408 3.33325 9.11671V9.21671C3.33325 9.64933 3.68396 10 4.11659 10H14.2166C14.6492 10 14.9999 9.64933 14.9999 9.21671V9.11671C14.9999 8.68408 14.6492 8.33337 14.2166 8.33337Z"
            fill="#9F9F9F"
          />
          <path
            d="M14.2166 0H4.11659C3.68396 0 3.33325 0.35071 3.33325 0.783333V0.883333C3.33325 1.31596 3.68396 1.66667 4.11659 1.66667H14.2166C14.6492 1.66667 14.9999 1.31596 14.9999 0.883333V0.783333C14.9999 0.35071 14.6492 0 14.2166 0Z"
            fill="#9F9F9F"
          />
        </svg>
        <span style="padding-left: 5px">List View</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import axios from "axios";
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";
import keyBy from "lodash/keyBy";
import map from "lodash/map";
import FilterContainer from "../components/FilterContainer.vue";
import ResultContainer from "../components/ResultContainer.vue";
import QuickFilter from "../components/QuickFilter.vue";
import MapContainer from "../components/MapContainer.vue";
import Icon from "ant-design-vue/lib/icon";
import { bus } from "../app.js";
import intersection from "lodash/intersection";

export default {
  components: {
    "filter-container": FilterContainer,
    "result-container": ResultContainer,
    "map-container": MapContainer,
    "quick-filter": QuickFilter,
    "a-button": Button,
    "a-icon": Icon,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
      mode: "list",
      loading: true,
      job_file_filter: null,
      mounted: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth < 768;
    },
  },
  mounted() {
    let $this = this;
    console.log("quick possession mounted");
    document.title =
      "New Quick Possession Homes For Sale Edmonton | Find New Homes In Edmonton | Sterling Homes";
    this.resizeEventFunction = function () {
      $this.updateMarginTop();
    };
    $this.updateMarginTop();
    window.addEventListener("resize", this.resizeEventFunction);
    this.mounted = true;
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    // axios.get("/wp-json/templatev2/v1/communities").then((response) => {
    //   $this.loading = false;
    //   $this.$refs.mapContainer.refreshCommunityMarkers(response.data);
    // });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventFunction);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    updateMarginTop() {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return;
      }
      let doc = document.documentElement;
      let mainContainer = document.getElementsByClassName("main-container")[0];
      console.log("fff", doc.offsetHeight, mainContainer.offsetTop);
      $(".main-container").css(
        "height",
        doc.offsetHeight - mainContainer.offsetTop - 150 + "px"
      );
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onRefresh() {
      this.$refs.resultContainer.refresh();
    },
    onResult(items, soldLots) {
      let style = window.getComputedStyle(
        document.getElementsByClassName("map-container")[0]
      );
      var itemIds = map(items, "id");
      if (style.display === "none") {
        // console.log("onresult-quickpossession", items);
        // let itemIds = Object.keys(keyBy(items, "id"));
        // console.log("onresult-quickpossession-itemids", itemIds);

        this.$refs.resultContainer.setVisibleItems(itemIds);
      } else {
        // this.$refs.mapContainer.refreshMarkers(items);
        this.$refs.mapContainer.refresh(items, soldLots);
        this.$refs.resultContainer.setVisibleItems(itemIds);
      }
    },
    onVisibleItems(itemIds) {
      this.$refs.resultContainer.setVisibleItems(itemIds);
    },
    toggleFilters() {
      $(".filter-container").addClass("mobile-filter-container");
      console.log(
        "filter click",
        document.getElementsByClassName("lf-base-content")
      );
      $(".lf-base-content").addClass("zindex-1001");
    },
    toggleMap() {
      this.mode = this.mode === "list" ? "map" : "list";

      // $(".map-container").toggle();
      // $(".result-container").toggle();
      if (this.mode == "map") {
        setTimeout(() => {
          console.log("ddd");
          this.$refs.mapContainer.resize();
        }, 100);
        // this.$refs.resultContainer.refresh();
      }
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
.filter-btn-wrapper {
  display: flex;
  border-left: 1px solid lightgrey;
  padding: 0 10px;
  img {
    width: 15px;
    height: 19px;
    margin: 0 5px;
  }
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
