<template>
  <div class="page">
    <div class="banner_wrapper">
      <img src="../assets/banner.png" alt="Banner" class="banner_img" />
      <h2 class="banner_title">Models</h2>
      <quick-filter @onRefresh="onRefresh" />
    </div>
    <div class="mobile-buttons" hidden>
      <a-button
        style="width: 98%"
        class="filtersBtn"
        @click="toggleFilters"
        :disabled="loading"
        >Filters</a-button
      >
    </div>
    <div class="main-container models-container">
      <filter-container @onRefresh="onRefresh" />
      <result-container
        ref="resultContainer"
        @onLoading="onLoading"
        @onLoaded="onLoaded"
      />
    </div>
  </div>
</template>

<script type="text/javascript">
import FilterContainer from "../components/ModelsFilterContainer.vue";
import ResultContainer from "../components/ResultContainer.vue";
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";
import QuickFilter from "../components/QuickFilter.vue";

export default {
  components: {
    "filter-container": FilterContainer,
    "result-container": ResultContainer,
    "a-button": Button,
    "quick-filter": QuickFilter,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
      loading: true,
    };
  },
  mounted() {
    let $this = this;
    document.title =
      "Home Designs | Build A New Home | Floorplans | Sterling Homes";
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
        doc.offsetHeight - mainContainer.offsetTop - 150 + "px"
      );
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onRefresh(filters) {
      this.$refs.resultContainer.refresh(filters);
    },
    toggleFilters() {
      $(".filter-container").addClass("mobile-filter-container");
      $(".lf-base-content").addClass("zindex-1001");
    },
  },
};
</script>

<style lang="scss" scoped>
.result-container {
  flex-grow: 1;
}
</style>

<style lang="scss">
.models-container {
  .results {
    .homes {
      grid-template-columns: repeat(auto-fill, 48%) !important;
    }
  }
}

@media all and (max-width: 1050px) {
  .models-container {
    .results {
      .homes {
        grid-template-columns: repeat(auto-fill, 48%) !important;
      }
    }
  }
}

@media all and (max-width: 800px) {
  .models-container {
    .results {
      .homes {
        grid-template-columns: repeat(auto-fill, 48%) !important;
      }
    }
  }
}

@media all and (max-width: 500px) {
  .models-container {
    .results {
      .homes {
        grid-template-columns: repeat(auto-fill, 100%) !important;
      }
    }
  }
}
</style>
