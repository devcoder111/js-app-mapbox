<template>
  <div class="page">
    <div class="mobile-buttons">
      <a-button
        style="width: 48%"
        class="filtersBtn"
        @click="toggleFilters"
        :disabled="loading"
        >Filters</a-button
      >
      <a-button
        style="width: 48%"
        @click="toggleMap"
        v-if="mode === 'list'"
        :disabled="loading"
        >Map View</a-button
      >
      <a-button
        style="width: 48%"
        @click="toggleMap"
        v-if="mode === 'map'"
        :disabled="loading"
        >List View</a-button
      >
    </div>
    <div class="main-container">
      <filter-container @onRefresh="onRefresh" />
      <map-container ref="mapContainer" @onVisibleItems="onVisibleItems" />
      <result-container
        ref="resultContainer"
        @onLoading="onLoading"
        @onLoaded="onLoaded"
        @onResult="onResult"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";
import keyBy from "lodash/keyBy";
import FilterContainer from "../components/FilterContainer.vue";
import ResultContainer from "../components/ResultContainer.vue";
import MapContainer from "../components/MapContainer.vue";

export default {
  components: {
    "filter-container": FilterContainer,
    "result-container": ResultContainer,
    "map-container": MapContainer,
    "a-button": Button,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
      mode: "list",
      loading: true,
    };
  },
  mounted() {
    let $this = this;
    document.title =
      "New Quick Possession Homes For Sale Edmonton | Find New Homes In Edmonton | Sterling Homes";
    this.resizeEventFunction = function () {
      $this.updateMarginTop();
    };
    $this.updateMarginTop();
    window.addEventListener("resize", this.resizeEventFunction);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventFunction);
  },
  methods: {
    updateMarginTop() {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return;
      }
      let doc = document.documentElement;
      let mainContainer = document.getElementsByClassName("main-container")[0];
      $(".main-container").css(
        "height",
        doc.offsetHeight - mainContainer.offsetTop - 200 + "px"
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
    onResult(items) {
      let style = window.getComputedStyle(
        document.getElementsByClassName("map-container")[0]
      );
      if (style.display === "none") {
        let itemIds = Object.keys(keyBy(items, "id"));
        this.$refs.resultContainer.setVisibleItems(itemIds);
      } else {
        this.$refs.mapContainer.refreshMarkers(items);
      }
    },
    onVisibleItems(itemIds) {
      this.$refs.resultContainer.setVisibleItems(itemIds);
    },
    toggleFilters() {
      $(".filter-container").addClass("mobile-filter-container");
      $(".lf-base-content").addClass("zindex-1001");
    },
    toggleMap() {
      this.mode = this.mode === "list" ? "map" : "list";
      $(".map-container").toggle();
      $(".result-container").toggle();
      this.$refs.resultContainer.refresh();
    },
  },
};
</script>

<style lang="scss" scoped></style>
