<template>
  <div class="community-box">
    <a-button
      size="small"
      type="link"
      style="font-size: 20px"
      @click.self="toggleCommunityFavorite(item)"
      ><a-icon
        type="heart"
        :theme="is_favorited ? 'filled' : 'twoTone'"
        twoToneColor="#eb2f96"
        style="color: #eb2f96"
    /></a-button>
    <div class="image-container" @click="openCommunity(item.id, item.area)">
      <div
        class="img"
        :style="{ '--image-url': 'url(' + item.image + ')' }"
      ></div>
    </div>
    <div class="title" @click.self="openCommunity(item.id, item.area)">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Button from "ant-design-vue/lib/button";
import Icon from "ant-design-vue/lib/icon";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/icon/style/css";

export default {
  components: {
    "a-button": Button,
    "a-icon": Icon,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapState(["community_favorites"]),
    is_favorited() {
      return this.community_favorites.hasOwnProperty(this.item.id);
    },
  },
  methods: {
    ...mapActions(["toggleCommunityFavorite"]),
    openCommunity(id, areaName) {
      window.location.href = this.item.link;
    },
  },
};
</script>

<style lang="scss" scoped></style>
