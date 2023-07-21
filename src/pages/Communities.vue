<template>
  <div class="page">
    <div class="filter-container">
      <div class="desktop-container" style="justify-content: flex-end">
        <my-favorites />
      </div>
    </div>
    <div class="main-container" style="border-top: 1px solid #ddd">
      <div class="result-container" v-if="loading">Loading</div>
      <div class="result-container" v-if="loading === false">
        <div>
          <div class="community-box-container">
            <div class="community-box">
              <div
                class="image-container"
                @click="openLink('https://www.sterlingedmonton.com/beaumont/')"
              >
                <div
                  class="img"
                  :style="{
                    '--image-url':
                      'url(https://www.sterlingedmonton.com/wp-content/uploads/Beaumont-1800x1000-c-default.jpg)',
                  }"
                ></div>
              </div>
              <div class="coming-soon">COMING SOON</div>
              <div
                class="title"
                @click.self="
                  openLink('https://www.sterlingedmonton.com/beaumont/')
                "
              >
                Beaumont
              </div>
              <div class="exclusive">Get on the exclusive VIP list</div>
            </div>
            <div class="community-box">
              <div
                class="image-container"
                @click="openLink('https://www.sterlingedmonton.com/aster/')"
              >
                <div
                  class="img"
                  :style="{
                    '--image-url':
                      'url(https://www.sterlingedmonton.com/wp-content/uploads/community-feature-best-of-springate-family-walk-featured-image-1800x1000-c-default.png)',
                  }"
                ></div>
              </div>
              <div class="coming-soon">COMING SOON</div>
              <div
                class="title"
                @click.self="
                  openLink('https://www.sterlingedmonton.com/aster/')
                "
              >
                Aster
              </div>
              <div class="exclusive">Get on the exclusive VIP list</div>
            </div>
          </div>
        </div>
        <div v-for="area in areas">
          <h2>{{ area.name }}</h2>
          <div class="community-box-container">
            <community-box
              :item="community"
              v-for="community in area.communities"
              :key="community.id"
            />
          </div>
        </div>
      </div>
      <map-container ref="mapContainer" type="community" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MyFavorites from "../components/MyFavorites.vue";
import MapContainer from "../components/MapContainer.vue";
import CommunityBox from "../components/CommunityBox.vue";
import Row from "ant-design-vue/lib/row";
import Column from "ant-design-vue/lib/col";
import "ant-design-vue/lib/row/style/css";
import "ant-design-vue/lib/col/style/css";

export default {
  components: {
    "my-favorites": MyFavorites,
    "map-container": MapContainer,
    "a-row": Row,
    "a-col": Column,
    "community-box": CommunityBox,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
      loading: true,
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
      },
    };
  },
  mounted() {
    let $this = this;
    document.title = "Communities - Where We Build | Sterling Homes";
    this.resizeEventFunction = function () {
      $this.updateMarginTop();
    };
    $this.updateMarginTop();
    window.addEventListener("resize", this.resizeEventFunction);
    axios.get("/wp-json/templatev2/v1/communities").then((response) => {
      $this.loading = false;
      $this.$refs.mapContainer.refreshMarkers(response.data);
      response.data.forEach((community) => {
        $this.areas[community.area].communities[community.id] = community;
      });
    });
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
    openLink(url) {
      window.location.href = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.result-container {
  flex: 1 !important;
  width: auto !important;
}

.map-container {
  flex: unset !important;
  width: 400px !important;
  margin-left: auto;
}

h2 {
  color: #353535;
  font-size: 25px;
}

.community-box-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .community-box {
    margin-right: 10px;

    .coming-soon {
      position: absolute;
      bottom: 80px;
      left: 0;
      right: 0;
      text-align: left;
      font-size: 13px;
      color: #fff;
      padding: 5px;
      font-family: "Raleway", sans-serif;
      font-weight: bold;
    }

    .title {
      bottom: 40px !important;
      font-size: 25px;
      text-transform: uppercase;
    }

    .exclusive {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      text-align: left;
      font-size: 10px;
      color: #fff;
      padding: 5px;
      font-family: "Raleway", sans-serif;
      font-weight: bold;
    }
  }
}
</style>
