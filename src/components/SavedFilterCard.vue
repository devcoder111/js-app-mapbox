<template>
  <a-card
    @click="loadSavedFilter"
    :class="{ 'card-active': isSelected, 'card-link': !isSelected }"
  >
    <a-button class="remove-button" type="link" @click="removeSavedFilter"
      ><a-icon type="close-circle"
    /></a-button>
    <div class="line-item">
      I am looking for <br /><strong>{{ itemType }}</strong>
    </div>
    <div class="line-item" v-if="formattedCommunities.length > 0">
      in <br /><strong>{{ formattedCommunities.join(", ") }}</strong>
    </div>
    <div class="line-item" v-if="formattedPrice">
      with a price of <br /><strong>{{ formattedPrice }}</strong>
    </div>
    <div
      class="line-item"
      v-if="
        item.baths > 0 ||
          item.beds > 0 ||
          (item.home_size_range[0] !== 0 && item.home_size_range[1] !== 5000)
      "
    >
      with <br />
      <strong v-if="item.baths > 0">+{{ item.baths }} Baths,</strong>
      <strong v-if="item.beds > 0">+{{ item.beds }} Beds,</strong>
      <strong
        v-if="item.home_size_range[0] !== 0 && item.home_size_range[1] !== 5000"
        >{{ item.home_size_range[0] }} ~
        {{ item.home_size_range[1] }} Sqft,</strong
      >
    </div>
    <div class="line-item" v-if="formattedHomeTypes.length > 0">
      with a type of <br /><strong>{{
        formattedHomeTypes.join(" or ")
      }}</strong>
    </div>
    <div class="line-item" v-if="formattedDate">
      available<br />
      <strong>{{ formattedDate }}</strong>
    </div>
  </a-card>
</template>

<script>
import moment from "moment";
import map from "lodash/map";
import Icon from "ant-design-vue/lib/icon";
import Button from "ant-design-vue/lib/button";
import Card from "ant-design-vue/lib/card";
import "ant-design-vue/lib/card/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/button/style/css";

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      communities: {
        14: "Allard",
        261: "Cavanagh",
        419: "College Woods at Secord",
        263: "Crimson in Creekwood Chappelle",
        264: "Cy Becker",
        12532: "Desrochers",
        12335: "Edgemont East",
        265: "Glenridding Heights",
        10808: "Graydon Hill",
        11286: "Keswick Landing",
        266: "Langdale",
        267: "Laurel Crossing",
        15738: "Kinglet",
        268: "Manning Village",
        8349: "McConachie Heights",
        20: "Newcastle",
        1249: "Orchards",
        3171: "Secord Heights",
        271: "Sienna",
        273: "Springate, Spruce Grove",
        269: "Tamarack Common",
        413: "The Uplands at Riverview",
        272: "Westerra, Stony Plain",
      },
      home_types: {
        townhome: "Townhomes",
        duplex: "Duplex Homes",
        laned: "Laned Homes",
        sterling: "Front Attached Home",
      },
    };
  },
  components: {
    "a-card": Card,
    "a-button": Button,
    "a-icon": Icon,
  },
  computed: {
    isSelected() {
      return this.$store.state.filter.key === this.item.key;
    },
    itemType() {
      switch (this.item.type) {
        case "quick-possessions":
          return "Quick Possessions";
        case "home-designs":
          return "Models";
        case "show-homes":
          return "Show Homes";
        default:
          return this.item.type;
      }
    },
    formattedPrice() {
      if (this.item.price_range[0] === 0 && this.item.price_range[1] === 1000) {
        return null;
      }
      return (
        this.formatPrice(this.item.price_range[0]) +
        " ~ " +
        this.formatPrice(this.item.price_range[1])
      );
    },
    formattedCommunities() {
      let $this = this;
      return map(this.item.communities, (value) => {
        return $this.communities[value];
      });
    },
    formattedHomeTypes() {
      let $this = this;
      return map(this.item.home_types, (value) => {
        return $this.home_types[value];
      });
    },
    formattedDate() {
      if (this.item.possession_date != null) {
        return moment(this.item.possession_date).format("MMM DD, YYYY");
      }
      return null;
    },
  },
  methods: {
    formatPrice(price) {
      if (price > 750) {
        return "1M";
      } else if (price > 0) {
        return price + "K";
      } else {
        return 0;
      }
    },
    removeSavedFilter() {
      this.$store.dispatch("removeSavedFilter", this.item.key);
    },
    loadSavedFilter() {
      if (this.isSelected) {
        return;
      }
      this.$emit("selectSavedFilter", this.item.key);
    },
  },
};
</script>

<style lang="scss" scoped>
strong {
  color: #144166;
}

.line-item {
  margin-bottom: 5px;
}

.card-link {
  cursor: pointer;
}

.card-active {
  cursor: default;
  background: #ddd;
}

.ant-card-body {
  position: relative;

  .remove-button {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
