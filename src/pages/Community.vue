<template>
  <div class="page">
    <a-modal
      title="Contact Sales"
      v-model="contact_sales_form_visible"
      :footer="null"
    >
      <div id="form">Loading....</div>
    </a-modal>
    <div class="filter-container">
      <div class="desktop-container">
        <a-button size="small" @click="backToCommunities()"
          ><a-icon type="left-circle" theme="twoTone" twoToneColor="#0e6ecd" />
          Back To Communities</a-button
        >
        <my-favorites />
      </div>
    </div>
    <div
      class="main-container"
      style="border-top: 1px solid #ddd; margin-bottom: 20px"
    >
      <div class="result-container" v-if="loading">Loading...</div>
      <div class="result-container" v-if="loading === false">
        <div class="cover-image-container">
          <a-button
            size="small"
            type="link"
            @click.self="toggleCommunityFavorite(community)"
            ><a-icon
              type="heart"
              :theme="is_favorited ? 'filled' : 'twoTone'"
              twoToneColor="#eb2f96"
              style="color: #eb2f96"
            />
            FAVORITE THIS</a-button
          >
          <div class="title">{{ community.name }}</div>
          <div class="section_menu">
            <div class="section_menu_item" @click="openQuickPossessions">
              QUICK POSSESSIONS
            </div>
            <div class="section_menu_item" @click="openModels">MODELS</div>
            <div class="section_menu_item" @click="openShowHomes">
              SHOW HOMES
            </div>
          </div>
          <div
            class="img"
            :style="{ '--image-url': 'url(' + community.cover + ')' }"
          ></div>
        </div>
        <div class="info">
          <p v-html="community.intro"></p>
          <a-button
            type="primary"
            size="large"
            style="margin: 10px 0"
            @click="openCallToActionLink"
            >{{ community.call_to_action_text }}</a-button
          >
        </div>
        <h2 class="section-title">AMENITIES</h2>
        <div class="amenities">
          <div class="tabs">
            <a
              @click="selected_school_tab_index = 0"
              :class="{ active: selected_school_tab_index === 0 }"
              >Elementary Schools</a
            >
            <a
              @click="selected_school_tab_index = 1"
              :class="{ active: selected_school_tab_index === 1 }"
              >Junior High Schools</a
            >
            <a
              @click="selected_school_tab_index = 2"
              :class="{ active: selected_school_tab_index === 2 }"
              >High Schools</a
            >
          </div>
          <div class="tab-panes">
            <table v-if="selected_school_tab_index === 0">
              <tr>
                <th class="name">School Name</th>
                <th>Distance</th>
              </tr>
              <tr v-for="school in community.elementary_schools">
                <td>{{ school.elementary_school }}</td>
                <td>{{ school.distance_from_home }} km</td>
              </tr>
            </table>

            <table v-if="selected_school_tab_index === 1">
              <tr>
                <th class="name">School Name</th>
                <th>Distance</th>
              </tr>
              <tr v-for="school in community.junior_high_schools">
                <td>{{ school.junior_high_school }}</td>
                <td>{{ school.distance_from_home }} km</td>
              </tr>
            </table>

            <table v-if="selected_school_tab_index === 2">
              <tr>
                <th class="name">School Name</th>
                <th>Distance</th>
              </tr>
              <tr v-for="school in community.high_schools">
                <td>{{ school.high_school }}</td>
                <td>{{ school.distance_from_home }} km</td>
              </tr>
            </table>
          </div>
          <div class="tabs" style="margin-top: 20px">
            <a
              @click="selected_facility_tab_index = 0"
              :class="{ active: selected_facility_tab_index === 0 }"
              >Shopping Facilities</a
            >
            <a
              @click="selected_facility_tab_index = 1"
              :class="{ active: selected_facility_tab_index === 1 }"
              >Medical Facilities</a
            >
            <a
              @click="selected_facility_tab_index = 2"
              :class="{ active: selected_facility_tab_index === 2 }"
              >Recreation Facilities</a
            >
          </div>
          <div class="tab-panes">
            <table v-if="selected_facility_tab_index === 0">
              <tr>
                <th class="name">Name</th>
                <th>Distance</th>
              </tr>
              <tr
                v-for="place in community.shopping"
                v-if="place.nearby_shopping !== ''"
              >
                <td>{{ place.nearby_shopping }}</td>
                <td>{{ place.distance_from_home }} km</td>
              </tr>
            </table>

            <table v-if="selected_facility_tab_index === 1">
              <tr>
                <th class="name">Name</th>
                <th>Distance</th>
              </tr>
              <tr
                v-for="place in community.medical"
                v-if="place.medical_facilities !== ''"
              >
                <td>{{ place.medical_facilities }}</td>
                <td>{{ place.distance_from_home }} km</td>
              </tr>
            </table>

            <table v-if="selected_facility_tab_index === 2">
              <tr>
                <th class="name">Name</th>
                <th>Distance</th>
              </tr>
              <tr
                v-for="place in community.recreation"
                v-if="place.recreation_facilities !== ''"
              >
                <td>{{ place.recreation_facilities }}</td>
                <td>{{ place.distance_from_home }} km</td>
              </tr>
            </table>
          </div>
        </div>
        <h2 class="section-title">COMMUTE TIME</h2>
        <div class="distance-calculator">
          <div class="search-inputs">
            <input type="text" :value="community.name" disabled="disabled" />
            <input type="text" id="autocomplete_search" disabled="disabled" />
          </div>
          <div class="navigation">
            <div class="buttons">
              <button
                :class="{ active: mapTravelMode === 'DRIVING' }"
                @click="changeTravelMode('DRIVING')"
              >
                <img src="../assets/car.png" />
              </button>
              <button
                :class="{ active: mapTravelMode === 'TRANSIT' }"
                @click="changeTravelMode('TRANSIT')"
              >
                <img src="../assets/bus.png" />
              </button>
              <button
                :class="{ active: mapTravelMode === 'WALKING' }"
                @click="changeTravelMode('WALKING')"
              >
                <img src="../assets/walking.png" />
              </button>
            </div>
            <div class="information">
              <strong>{{ mapTravelDuration }}</strong> {{ mapTravelDistance }}
            </div>
            <div class="direction-link" v-if="mapTravelLink">
              <a :href="mapTravelLink" target="_blank">See Directions</a>
            </div>
          </div>
        </div>
        <h2 class="section-title">SALES CENTRE</h2>
        <div class="sales-centre">
          <div class="sales-centre-item">
            <h2>
              <span v-if="community.manager.name">{{
                community.manager.name
              }}</span>
            </h2>
            <div style="margin: 5px 0">
              <a @click="showContactSalesForm"
                ><a-icon type="mail" theme="twoTone" twoToneColor="#0e6ecd" />
                EMAIL ME</a
              >
            </div>
            <div style="margin: 5px 0" v-if="community.manager.phone">
              <a-icon type="phone" theme="twoTone" twoToneColor="#0e6ecd" />
              {{ community.manager.phone }}
              <a :href="'tel:' + community.manager.phone">CALL US</a>
            </div>
            <div style="margin: 5px 0" v-if="community.manager.address">
              <a-icon type="search" theme="twoTone" twoToneColor="#0e6ecd" />
              {{ community.manager.address }}
            </div>
          </div>
          <div class="sales-centre-item">
            <h2>Hours</h2>
            <div v-html="community.manager.hours"></div>
            <a-button
              type="primary"
              size="large"
              style="margin: 10px 0"
              @click="showContactSalesForm"
              >CONTACT SALES</a-button
            >
          </div>
        </div>
      </div>
      <map-container ref="mapContainer" type="community" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "store";
import { mapState, mapActions } from "vuex";
import MyFavorites from "../components/MyFavorites.vue";
import MapContainer from "../components/MapContainer.vue";
import Row from "ant-design-vue/lib/row";
import Column from "ant-design-vue/lib/col";
import Button from "ant-design-vue/lib/button";
import Icon from "ant-design-vue/lib/icon";
import Input from "ant-design-vue/lib/input";
import Modal from "ant-design-vue/lib/modal";
import Tabs from "ant-design-vue/lib/tabs";
import "ant-design-vue/lib/row/style/css";
import "ant-design-vue/lib/col/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/tabs/style/css";

export default {
  components: {
    "my-favorites": MyFavorites,
    "map-container": MapContainer,
    "a-row": Row,
    "a-col": Column,
    "a-button": Button,
    "a-icon": Icon,
    "a-input": Input,
    "a-modal": Modal,
    "a-tabs": Tabs,
    "a-tab-pane": Tabs.TabPane,
  },
  data() {
    return {
      resizeEventFunction: null,
      offsetTop: 0,
      selected_school_tab_index: 0,
      selected_facility_tab_index: 0,
      contact_sales_form_visible: false,
      mapAutoCompleteListener: null,
      mapAutoComplete: null,
      mapLatestPlace: null,
      mapTravelMode: "DRIVING",
      mapTravelFound: false,
      mapTravelDuration: null,
      mapTravelDistance: null,
      mapTravelLink: null,
      loading: true,
      community: {
        id: 0,
      },
    };
  },
  computed: {
    ...mapState(["community_favorites"]),
    is_favorited() {
      return this.community_favorites.hasOwnProperty(this.community.id);
    },
  },
  mounted() {
    let $this = this;
    this.resizeEventFunction = function () {
      $this.updateMarginTop();
    };
    $this.updateMarginTop();
    window.addEventListener("resize", this.resizeEventFunction);
    window.scrollTo(0, 0);
    axios
      .get("/wp-json/templatev2/v1/community-detail", {
        params: { id: this.$route.params.id },
      })
      .then((response) => {
        $this.loading = false;
        $this.community = response.data;
        document.title =
          "New Homes for Sale in " +
          $this.community.name +
          " | New Home Builder in " +
          $this.community.name +
          " | Sterling Homes";
        $this.$refs.mapContainer.refreshMarkers([$this.community]);
      });
    setTimeout(() => {
      let input = document.getElementById("autocomplete_search");
      input.removeAttribute("disabled");
      $this.mapAutoComplete = new google.maps.places.Autocomplete(input);
      $this.mapAutoCompleteListener = google.maps.event.addListener(
        $this.mapAutoComplete,
        "place_changed",
        $this.searchOnMap
      );
    }, 2000);
  },
  destroyed() {
    google.maps.event.removeListener(this.mapAutoCompleteListener);
    google.maps.event.clearInstanceListeners(this.mapAutoComplete);
    window.removeEventListener("resize", this.resizeEventFunction);
  },
  methods: {
    ...mapActions(["toggleCommunityFavorite"]),
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
    openCallToActionLink() {
      window.location.href = this.community.call_to_action_link;
    },
    showContactSalesForm() {
      let $this = this;
      this.contact_sales_form_visible = true;
      $("#form").html("Loading...");
      setTimeout(() => {
        hbspt.forms.create({
          cssClass: "custom-hubspot",
          portalId: $this.community.hs_portal_id,
          formId: $this.community.hs_form_id,
          target: "#form",
        });
      }, 500);
    },
    backToCommunities() {
      this.$router.push("/communities");
    },
    openQuickPossessions() {
      store.set("quick-possessions_filter", {
        key: null,
        type: null,
        communities: [this.$route.params.id],
        price_range: [0, 1000],
        released_market: [],
        beds: 0,
        baths: 0,
        possession_date: null,
        home_size_range: [0, 5000],
        home_types: [],
        features: [],
      });
      this.$router.push("/quick-possessions");
    },
    openModels() {
      store.set("home-designs_filter", {
        key: null,
        type: null,
        communities: [this.$route.params.id],
        price_range: [0, 1000],
        released_market: [],
        beds: 0,
        baths: 0,
        possession_date: null,
        home_size_range: [0, 5000],
        home_types: [],
        features: [],
      });
      this.$router.push("/home-designs");
    },
    openShowHomes() {
      store.set("show-homes_filter", {
        key: null,
        type: null,
        communities: [this.$route.params.id],
        price_range: [0, 1000],
        released_market: [],
        beds: 0,
        baths: 0,
        possession_date: null,
        home_size_range: [0, 5000],
        home_types: [],
        features: [],
      });
      this.$router.push("/showhomes");
    },
    searchOnMap() {
      this.mapLatestPlace = this.mapAutoComplete.getPlace();
      let origin = new google.maps.LatLng(
        this.community.lat,
        this.community.lng
      );
      let destination = new google.maps.LatLng(
        this.mapLatestPlace.geometry["location"].lat(),
        this.mapLatestPlace.geometry["location"].lng()
      );
      let service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: this.mapTravelMode,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        this.getDistanceCallback
      );
    },
    changeTravelMode(travelMode) {
      this.mapTravelMode = travelMode;
      this.searchOnMap();
    },
    getDistanceCallback(response, status) {
      this.mapTravelFound = false;
      this.mapTravelDistance = null;
      this.mapTravelDuration = null;
      this.mapTravelLink = null;
      if (status === "OK" && response.rows.length > 0) {
        let result = response.rows[0].elements;
        if (result[0].status === "OK") {
          this.mapTravelFound = true;
          this.mapTravelDistance = result[0].distance.text;
          this.mapTravelDuration = result[0].duration.text;
          if (response.hasOwnProperty("destinationAddresses")) {
            this.mapTravelLink =
              "https://www.google.com/maps/dir/?api=1&origin=" +
              this.community.lat +
              "," +
              this.community.lng +
              "&destination=" +
              response.destinationAddresses[0] +
              "&travelmode=" +
              this.mapTravelMode;
          }
          return;
        }
      }
      this.mapTravelDistance = "No results for this travel mode";
      this.mapTravelDuration = "Sorry";
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

h1 {
  font-family: "Raleway", sans-serif;
}

h2.section-title {
  font-family: "Raleway", sans-serif;
  font-weight: bold;
  color: #144464;
  font-size: 18px;
  padding: 4px 4px 4px 0px;
  border-bottom: 1px solid #144464;
}

.result-container {
  .info {
    margin: 20px 0;
  }
}

.amenities {
  margin-bottom: 20px;

  .tabs {
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;

    a {
      display: inline-block;
      height: 100%;
      margin: 0 32px 0 0;
      padding: 12px 16px;
      box-sizing: border-box;
      position: relative;
      transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      cursor: pointer;
      text-decoration: none;

      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
        font-weight: 500;
      }
    }
  }

  .tab-panes {
  }

  table {
    width: 100%;

    th {
      font-weight: bold;
      text-align: left;
    }

    th.name {
      width: 350px;
    }

    td {
      padding: 3px 0;
    }
  }
}

.distance-calculator {
  display: flex;
  justify-content: space-between;

  .search-inputs {
    width: 49%;

    input {
      display: block;
      width: 100%;
      border-radius: 3px;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      border: 1px solid #ddd;
      padding: 5px;
      margin-bottom: 10px;

      &:disabled {
        background: #eee;
      }
    }
  }

  .navigation {
    width: 49%;

    .buttons {
      margin-bottom: 10px;
    }

    button {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      padding: 2px;

      img {
        height: 28px;
      }

      &.active,
      &:hover {
        background: #ddd;
      }
    }
  }
}

.sales-centre {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .sales-centre-item {
    width: 49%;
    background: #eee;
    padding: 20px;
    font-size: 14px;

    h2 {
      font-size: 19px;
    }
  }
}

.cover-image-container {
  overflow: hidden;
  width: 100%;
  height: 300px;
  position: relative;

  button {
    position: absolute;
    top: 0;
    right: 0;
    font-family: "Raleway", sans-serif;
    color: #fff;
    font-size: 15px;
    padding: 10px;
  }

  .title {
    position: absolute;
    display: flex;
    width: 100%;
    top: 80px;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: "Satisfy", cursive;
    font-weight: bold;
    font-size: 35px;
    color: #fff;
  }

  .img {
    width: 100%;
    height: 300px;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      var(--image-url);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }

  .section_menu {
    display: flex;
    position: absolute;
    justify-content: space-between;
    bottom: 0;
    left: 0;
    right: 0;
    background: #394a6d;

    div.section_menu_item {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #fff;
      font-size: 15px;
      width: 33.3%;
      height: 50px;
      font-family: "Raleway", sans-serif;
      font-weight: bold;
      background: #23374d;

      &:hover {
        background: #ec2147;
      }
    }
  }
}

@media all and (max-width: 600px) {
  .sales-centre {
    .sales-centre-item {
      width: 100%;
    }
  }

  .cover-image-container {
    .section_menu {
      div.section_menu_item {
        font-size: 13px;
      }
    }
  }

  .amenities {
    table {
      th.name {
        width: auto;
      }
    }

    .tabs {
      a {
        display: inline-block;
        height: 100%;
        margin: 0 4px 0 0;
        padding: 3px 4px;
        box-sizing: border-box;
        position: relative;
        transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        cursor: pointer;
        text-decoration: none;
        font-size: 13px;
      }
    }
  }
}
</style>

<style lang="scss">
.hs-submit {
  text-align: right;
}
</style>
