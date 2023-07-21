<template>
  <div class="page">
    <filter-container @onRefresh="onRefresh" :disable-floating-button="true" />
    <div class="main-container models-container">
      <result-container ref="resultContainer" @onResult="onResult" />
    </div>
  </div>
</template>

<script type="text/javascript">
import keyBy from "lodash/keyBy";
import FilterContainer from "../components/FilterContainer.vue";
import ResultContainer from "../components/ResultContainer.vue";

export default {
  components: {
    "filter-container": FilterContainer,
    "result-container": ResultContainer,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
    };
  },
  methods: {
    onRefresh() {
      this.$refs.resultContainer.refresh();
    },
    onResult(items) {
      let itemIds = Object.keys(keyBy(items, "id"));
      this.$refs.resultContainer.setVisibleItems(itemIds);
    },
    onVisibleItems(itemIds) {
      this.$refs.resultContainer.setVisibleItems(itemIds);
    },
  },
};
</script>

<style type="text/css">
html,
body {
  height: unset !important;
  width: unset !important;
  overflow: unset !important;
}
</style>

<style lang="scss">
.floating-action-button {
  display: none;
}

.main-container {
  width: 100% !important;
  height: 600px;
}

.result-container {
  width: 100% !important;
}

.results {
  .homes {
    grid-template-columns: repeat(auto-fill, 49%) !important;
  }
}

.models-container {
  .results {
    .homes {
      grid-template-columns: repeat(auto-fill, 49%) !important;
    }
  }
}

@media all and (max-width: 1050px) {
  .models-container {
    .results {
      .homes {
        grid-template-columns: repeat(auto-fill, 49%) !important;
      }
    }
  }
}

@media all and (max-width: 800px) {
  .models-container {
    .results {
      .homes {
        grid-template-columns: repeat(auto-fill, 49%) !important;
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
