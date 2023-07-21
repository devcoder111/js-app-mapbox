<template>
  <div class="favorites-button-container">
    <a-button size="small" @click="show"
      ><a-icon type="heart" theme="twoTone" twoToneColor="#eb2f96" /> My
      Favorites</a-button
    >
    <a-modal v-model="visible" :maskClosable="false" width="800px">
      <div class="modal-content">
        <a-tabs defaultActiveKey="saved-filters" v-model="active_tab">
          <a-tab-pane tab="Saved Filters" key="saved-filters">
            <div class="saved-filters">
              <saved-filter-card
                v-for="item in saved_filters"
                :key="item.key"
                :item="item"
                @selectSavedFilter="selectSavedFilter"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="Favorite Homes" key="favorite-homes">
            <div class="favorite-homes">
              <home-box
                :item="item"
                :key="item.id"
                v-for="item in favorites"
                v-if="item.is_favorited"
              />
            </div>
          </a-tab-pane>
          <a-tab-pane tab="Favorite Communities" key="favorite-communities">
            <div class="favorite-communities">
              <community-box
                :item="item"
                :key="item.id"
                v-for="item in community_favorites"
                v-if="item.is_favorited"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="close()">Close</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HomeBox from "./HomeBox.vue";
import CommunityBox from "./CommunityBox.vue";
import SavedFilterCard from "./SavedFilterCard.vue";
import Tab from "ant-design-vue/lib/tabs";
import Modal from "ant-design-vue/lib/modal";
import Icon from "ant-design-vue/lib/icon";
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/tabs/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/modal/style/css";

export default {
  components: {
    "saved-filter-card": SavedFilterCard,
    "a-modal": Modal,
    "a-icon": Icon,
    "a-button": Button,
    "a-tabs": Tab,
    "a-tab-pane": Tab.TabPane,
    "home-box": HomeBox,
    "community-box": CommunityBox,
  },
  data() {
    return {
      visible: false,
      active_tab: "saved-filters",
    };
  },
  computed: {
    ...mapState(["favorites", "community_favorites", "saved_filters"]),
  },
  watch: {
    $route(to, from) {
      this.showViaQuery();
    },
  },
  mounted() {
    this.showViaQuery();
  },
  methods: {
    showViaQuery() {
      if (this.$route.query.hasOwnProperty("show-saved-filters")) {
        this.visible = true;
        this.active_tab = "saved-filters";
      } else if (this.$route.query.hasOwnProperty("show-favorite-homes")) {
        this.visible = true;
        this.active_tab = "favorite-homes";
      } else if (
        this.$route.query.hasOwnProperty("show-favorite-communities")
      ) {
        this.visible = true;
        this.active_tab = "favorite-communities";
      }
    },
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    selectSavedFilter(filterKey) {
      let $this = this;
      this.visible = false;
      let filter = this.saved_filters[filterKey];
      if (this.$route.name === filter.type) {
        this.$parent.filter.communities = filter.communities;
        this.$parent.filter.price_range = filter.price_range;
        this.$parent.filter.beds = filter.beds;
        this.$parent.filter.baths = filter.baths;
        this.$parent.filter.possession_date = filter.possession_date;
        this.$parent.filter.home_size_range = filter.home_size_range;
        this.$parent.filter.home_types = filter.home_types;
        this.$parent.refresh();
      } else {
        this.$store
          .dispatch("saveFilter", { routeName: filter.type, filter: filter })
          .then(() => {
            $this.$router.push({ name: filter.type });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.favorite-communities {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .community-box {
    margin-right: 10px;
  }
}
</style>
