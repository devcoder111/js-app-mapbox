<template>
  <div class="map-container">
    <div class="back-btn-wrapper">
      <a-button @click="backCommunities" class="customBtn">Back</a-button>
    </div>
    <div class="map-colors-info" v-if="this.$route.name == 'quick-possessions'">
      <div class="map-color map-color-available"><span></span> Available</div>
      <div class="map-color map-color-conditional"><span></span> Pending</div>
      <div class="map-color map-color-sold"><span></span> Sold</div>
    </div>
    <div class="loading_wrapper" v-show="loading">
      <img src="../assets/home_loading.gif" />
    </div>
    <div id="mapContainer"></div>
  </div>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { bus } from "../app.js";
import filter from "lodash/filter";
import community_underlay from "../community_underlay/community_underlay.json";
import MapPopup from "./MapPopup.vue";
import { h, nextTick, render } from "vue";
import Vue from "vue";

export default {
  props: {
    type: {
      type: String,
      default: "home",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    MapPopup,
  },
  data() {
    return {
      map: {},
      communities: {},
      filteredItems: {},
      soldLots: [],
      accessToken:
        "pk.eyJ1Ijoic3Rlcmxpbmdob21lcyIsImEiOiJja3V4cDJueG42dTdiMndvODl6dW5iMHhoIn0.nRQ9fvqhoDKgQqmo8mQRLg",
      isFourPlusBeds: false,
      isUnder400: false,
      isUnder500: false,
      isLegalSuite: false,
      topMenuHeight: 0,
      initialMarginSize: 0,
      map_filters_visible: false,
      info_window: null,
      map: null,
      marker_clusterer: null,
      markers: [],
      items: [],
      cached_marker_items: [],
      scrollIntance: null,
      resizeInstance: null,
      filter: {},
      popupHome: {},
      totalPolygons: {
        type: "FeatureCollection",
        name: "communityPolygons",
        crs: {
          type: "name",
          properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
        },
        features: [],
      },
      totalHomes: {},
    };
  },
  mounted() {
    this.setUpMap();
  },
  async created() {
    // const response = await fetch("../mapdata/Kinglet.geojson");
    // this.geojson = await response.json();
    // console.log("community_underlay", community_underlay);
    var that = this;
    bus.$on("communities", async (communities) => {
      this.communities = communities;
      await axios
        .get("/wp-json/templatev2/v1/search", {
          params: {},
        })
        .then((response) => {
          this.totalHomes = response.data.items;
          console.log("this.totalHomes", response);
        });
      console.log("totalHomes-", this.totalHomes);
      var ss = [];
      for (const community of communities) {
        const pin = document.createElement("div");

        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = community.name;
        titleDiv.className = "community-marker-title";
        pin.appendChild(titleDiv);
        pin.addEventListener("click", () => {
          // this.selectCommunity(community);
          this.$store.state.filter.communities = [community.id];
        });

        const el = document.createElement("div");
        pin.className = "community-marker";
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.backgroundSize = "100%";
        el.style.margin = "auto";
        el.className = "marker-img";
        el.style.backgroundImage = `url(${require("../assets/home-pin.png")})`;
        pin.appendChild(el);
        el.addEventListener("click", () => {
          // this.selectCommunity(community);
          this.$store.state.filter.communities = [community.id];
        });

        new mapboxgl.Marker(pin)
          .setLngLat([community.lng, community.lat])
          .addTo(this.map);
        var communityShortName = community.name.replace(/\s/g, "");

        if (community_underlay[communityShortName]) {
          this.map.addSource("overlay" + communityShortName, {
            type: "image",
            url: require(`../community_underlay/images/${communityShortName}.png`),
            coordinates: community_underlay[communityShortName].coordinates,
          });
          this.map.addLayer({
            id: "overlay" + communityShortName,
            type: "raster",
            source: "overlay" + communityShortName,
            paint: {
              "raster-fade-duration": 0,
            },
          });
        }
        await import(`../mapdata/${communityShortName}.json`)
          .then((polygons) => {
            this.totalPolygons.features = this.totalPolygons.features.concat(
              polygons.features
            );
          })
          .catch((e) => {
            console.log("no data", e);
          });
      }
      for (var i = 0; i < this.totalPolygons.features.length; i++) {
        this.totalPolygons.features[i].properties.name =
          "Lot #" +
          (i + 1) +
          "--" +
          this.totalPolygons.features[i].properties.Lot_Number +
          "--" +
          this.totalPolygons.features[i].properties.jobfile;
        var home = [];
        if (
          this.totalPolygons.features[i].properties.type &&
          this.totalPolygons.features[i].properties.type == "showhome"
        )
          this.totalPolygons.features[i].properties.name = "Show Home";
        else if (this.totalPolygons.features[i].properties.jobfile != null) {
          home = filter(this.totalHomes, function (o) {
            return (
              o.job_file == that.totalPolygons.features[i].properties.jobfile
            );
          });
          if (home.length == 1) {
            this.totalPolygons.features[i].properties.name = home[0].title;
            this.totalPolygons.features[i].properties.status =
              home[0].offer_status;
          } else {
            if (this.totalPolygons.features[i].properties.status == "Sold") {
              this.totalPolygons.features[i].properties.name = "Sold";
            } else {
              this.totalPolygons.features[i].properties.name = "Filtered Out";
              this.totalPolygons.features[i].properties.status = "FilteredOut";
              var removedSoldHomes = this.soldLots.filter(
                (e) =>
                  e.job_no == this.totalPolygons.features[i].properties.jobfile
              ); //this is differet type sold homes(sold_lots post tye)
              if (removedSoldHomes.length > 0) {
                this.totalPolygons.features[i].properties.name = "Sold";
                this.totalPolygons.features[i].properties.status = "Sold";
              }
            }
          }
          this.totalPolygons.features[i].properties.home = home[0];
        } else {
          this.totalPolygons.features[i].properties.name = "Not Available";
          // polygons.features[i].properties.name = "Other Builder";
        }
        // polygons.features[i].properties.name =
        //   home.length == 1 ? home[0].title : "Not Available";
        // polygons.features[i].properties.status =
        //   home.length == 1 ? home[0].offer_status : "unknown";
      }
      console.log("polygons-", this.totalPolygons, this.map);

      // Add a data source containing GeoJSON data
      this.map.addSource("sterling_edmonton", {
        type: "geojson",
        data: this.totalPolygons,
        generateId: true,
      });

      var lot_color = "#0080ff";

      // Add a layer to visualize the polygon
      this.map.addLayer({
        id: "sterling_edmonton",
        type: "fill",
        source: "sterling_edmonton",
        layout: {},
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "type"], "showhome"],
            "#30D5C8",
            ["==", ["get", "jobfile"], null],
            "grey",
            ["==", ["get", "status"], "Available"],
            "green",
            ["==", ["get", "status"], "Conditional"],
            "#ffba08",
            ["==", ["get", "status"], "Pending"],
            "#ffba08",
            ["==", ["get", "status"], "FilteredOut"],
            "blue",
            ["==", ["get", "status"], "Sold"],
            "red",
            "#FC384A",
          ],
          "fill-opacity": 0.5,
        },
        minzoom: 13,
      });

      var _that = this;
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      var lotId = null;

      this.map.on("mousemove", "sterling_edmonton", function (e) {
        _that.map.getCanvas().style.cursor = "pointer";
        if (lotId) {
          _that.map.removeFeatureState(
            {
              source: "sterling_edmonton",
              id: lotId,
            },
            {
              hover: false,
            }
          );
          if (_that.map.getLayer("polygon-border"))
            _that.map.removeLayer("polygon-border");
        }
        lotId = e.features[0].id;
        // set the hover attribute to true with feature state
        _that.map.setFeatureState(
          {
            source: "sterling_edmonton",
            id: lotId,
          },
          {
            hover: true,
          }
        );
        if (_that.map.getLayer("polygon-border")) {
          _that.map.removeLayer("polygon-border");
        }
        // this.map.setFilter("sterling_edmonton", ["==", "jobfile", itemid]);

        if (
          _that.map.getSource("sterling_edmonton") &&
          e.features[0].properties.jobfile
        ) {
          _that.map.addLayer({
            id: "polygon-border",
            type: "line",
            source: "sterling_edmonton",
            layout: {},
            paint: {
              "line-color": "white",
              "line-opacity": [
                "case",
                ["==", ["get", "jobfile"], e.features[0].properties.jobfile],
                1,
                0,
              ],
              "line-width": 2,
            },
          });
        }
        // popup
        //   .setLngLat(e.lngLat)
        //   .setHTML(
        //     `<div id="map-hover-popup-content">` +
        //       e.features[0].properties.name +
        //       `</div>`
        //   )
        //   .addTo(_that.map);
        var selectedHome = e.features[0].properties.home
          ? JSON.parse(e.features[0].properties.home)
          : null;
        var propertyName = e.features[0].properties.name;

        console.log("lnglat", e.lngLat);
        _that.openPopup(e.lngLat, selectedHome, e.features[0].properties);
      });

      this.map.on("mouseleave", "sterling_edmonton", () => {
        if (lotId) {
          _that.map.setFeatureState(
            {
              source: "sterling_edmonton",
              id: lotId,
            },
            {
              hover: false,
            }
          );
        }
        lotId = null;

        // Reset the cursor style
        _that.map.getCanvas().style.cursor = "";
        popup.remove();
      });

      this.map.on("click", "sterling_edmonton", (e) => {
        console.log("event-", e.features);
        var selectedHome = e.features[0].properties.home
          ? JSON.parse(e.features[0].properties.home)
          : null;
        var propertyName = e.features[0].properties.name;
        if (e.features[0].properties.home) {
          bus.$emit("scrollTo", selectedHome.id);
        }
        console.log("lnglat", e.lngLat);
        this.openPopup(e.lngLat, selectedHome, e.features[0].properties);
      });
    });
    bus.$on("homeItemhover", (itemid) => {
      console.log("homeItemhover-", itemid);
      if (this.map.getLayer("polygon-border")) {
        this.map.removeLayer("polygon-border");
      }
      // this.map.setFilter("sterling_edmonton", ["==", "jobfile", itemid]);
      if (this.map.getSource("sterling_edmonton")) {
        this.map.addLayer({
          id: "polygon-border",
          type: "line",
          source: "sterling_edmonton",
          layout: {},
          paint: {
            "line-color": "white",
            "line-opacity": ["case", ["==", ["get", "jobfile"], itemid], 1, 0],
            "line-width": 2,
          },
        });
      }
    });
    bus.$on("openMarker", (item) => {
      console.log("markers", item);
      var lngLat = {
        lat: item.lat,
        lng: item.lng,
      };
      this.openPopup(lngLat, item);
    });
  },
  computed: {
    possessionFilters: {
      get() {
        console.log("possessionFilters");
        return this.$store.state.filter;
      },
    },
  },
  watch: {
    possessionFilters: {
      handler(val) {
        console.log("community changed", val);
        this.onRefresh();
      },
      deep: true,
    },
  },
  methods: {
    backCommunities() {
      this.$store.state.filter.communities = [];
      // this.$router.push({});
      // this.$emit("onRefresh");
    },
    onRefresh() {
      this.$emit("onRefresh");
    },
    resize() {
      this.map.resize();
      var that = this;
      this.map.on("render", function () {
        that.map.resize();
      });
      console.log("resize---");
    },
    setUpMap() {
      mapboxgl.accessToken = this.accessToken;
      // var mapCenter = [-113.49848717382815, 53.54067477803275];
      var mapCenter = [-113.59475, 53.534637];

      this.map = new mapboxgl.Map({
        container: "mapContainer",
        style: "mapbox://styles/sterlinghomes/cliebkgik001z01r970icbhmf",
        center: mapCenter,
        zoom: 9.6,
      });
      var that = this;
      that.map.resize();

      this.map.on("render", function () {
        that.map.resize();
      });
      this.popupHome = new mapboxgl.Popup({
        closeButton: false,
      });
      this.map.on("moveend", () => {
        // Get the visible markers based on the current map bounds
        // const visibleMarkers = filterMarkersByBounds();
        // console.log("Visible markers:", visibleMarkers);
        // Do whatever you want with the visible markers data
      });
    },
    selectCommunity(community) {
      var communityShortName = community.name.replace(/\s/g, "");
      console.log("filtereditem--", this.filteredItems);
      // if (this.map.getSource("sterling_edmonton")) {
      //   // this.map.removeLayer("sterling_edmonton");
      //   if (this.map.getLayer("polygon-border"))
      //     this.map.removeLayer("polygon-border");
      //   // this.map.removeSource("sterling_edmonton");
      // }
      // if (this.map.getSource("overlay")) {
      //   this.map.removeLayer("overlay");
      //   this.map.removeSource("overlay");
      // }
      // import(`../mapdata/${communityShortName}.json`).then((polygons) => {
      //   for (var i = 0; i < polygons.features.length; i++) {
      //     polygons.features[i].properties.name =
      //       "Lot #" +
      //       (i + 1) +
      //       "--" +
      //       polygons.features[i].properties.Lot_Number +
      //       "--" +
      //       polygons.features[i].properties.jobfile;
      //     var home = [];
      //     if (
      //       polygons.features[i].properties.type &&
      //       polygons.features[i].properties.type == "showhome"
      //     )
      //       polygons.features[i].properties.name = "Show Home";
      //     else if (polygons.features[i].properties.jobfile != null) {
      //       home = filter(this.filteredItems, function (o) {
      //         return o.job_file == polygons.features[i].properties.jobfile;
      //       });
      //       if (home.length == 1) {
      //         polygons.features[i].properties.name = home[0].title;
      //         polygons.features[i].properties.status = home[0].offer_status;
      //       } else {
      //         if (polygons.features[i].properties.status == "Sold") {
      //           polygons.features[i].properties.name = "Sold";
      //         } else {
      //           polygons.features[i].properties.name = "Filtered Out";
      //           polygons.features[i].properties.status = "FilteredOut";
      //         }
      //       }
      //       polygons.features[i].properties.home = home[0];
      //     } else {
      //       polygons.features[i].properties.name = "Not Available";
      //       // polygons.features[i].properties.name = "Other Builder";
      //     }
      //     // polygons.features[i].properties.name =
      //     //   home.length == 1 ? home[0].title : "Not Available";
      //     // polygons.features[i].properties.status =
      //     //   home.length == 1 ? home[0].offer_status : "unknown";
      //   }
      //   console.log("polygons-", polygons);
      //   if (community_underlay[communityShortName]) {
      //     this.map.addSource("overlay", {
      //       type: "image",
      //       url: require(`../community_underlay/images/${communityShortName}.png`),
      //       coordinates: community_underlay[communityShortName].coordinates,
      //     });
      //     this.map.addLayer({
      //       id: "overlay",
      //       type: "raster",
      //       source: "overlay",
      //       paint: {
      //         "raster-fade-duration": 0,
      //       },
      //     });
      //   }
      //   // Add a data source containing GeoJSON data
      //   this.map.addSource("sterling_edmonton", {
      //     type: "geojson",
      //     data: polygons,
      //     generateId: true,
      //   });

      //   var lot_color = "#0080ff";

      //   // Add a layer to visualize the polygon
      //   this.map.addLayer({
      //     id: "sterling_edmonton",
      //     type: "fill",
      //     source: "sterling_edmonton",
      //     layout: {},
      //     paint: {
      //       "fill-color": [
      //         "case",
      //         ["==", ["get", "type"], "showhome"],
      //         "#30D5C8",
      //         ["==", ["get", "jobfile"], null],
      //         "grey",
      //         ["==", ["get", "status"], "Available"],
      //         "green",
      //         ["==", ["get", "status"], "Conditional"],
      //         "#ffba08",
      //         ["==", ["get", "status"], "Pending"],
      //         "#ffba08",
      //         ["==", ["get", "status"], "FilteredOut"],
      //         "blue",
      //         ["==", ["get", "status"], "Sold"],
      //         "red",
      //         "#FC384A",
      //       ],
      //       "fill-opacity": 0.5,
      //     },
      //   });

      //   var _that = this;
      //   const popup = new mapboxgl.Popup({
      //     closeButton: false,
      //     closeOnClick: false,
      //   });
      //   var lotId = null;

      //   this.map.on("mousemove", "sterling_edmonton", function (e) {
      //     _that.map.getCanvas().style.cursor = "pointer";
      //     if (lotId) {
      //       _that.map.removeFeatureState(
      //         {
      //           source: "sterling_edmonton",
      //           id: lotId,
      //         },
      //         {
      //           hover: false,
      //         }
      //       );
      //       if (_that.map.getLayer("polygon-border"))
      //         _that.map.removeLayer("polygon-border");
      //     }
      //     lotId = e.features[0].id;
      //     // set the hover attribute to true with feature state
      //     _that.map.setFeatureState(
      //       {
      //         source: "sterling_edmonton",
      //         id: lotId,
      //       },
      //       {
      //         hover: true,
      //       }
      //     );
      //     if (_that.map.getLayer("polygon-border")) {
      //       _that.map.removeLayer("polygon-border");
      //     }
      //     // this.map.setFilter("sterling_edmonton", ["==", "jobfile", itemid]);

      //     if (
      //       _that.map.getSource("sterling_edmonton") &&
      //       e.features[0].properties.jobfile
      //     ) {
      //       _that.map.addLayer({
      //         id: "polygon-border",
      //         type: "line",
      //         source: "sterling_edmonton",
      //         layout: {},
      //         paint: {
      //           "line-color": "white",
      //           "line-opacity": [
      //             "case",
      //             ["==", ["get", "jobfile"], e.features[0].properties.jobfile],
      //             1,
      //             0,
      //           ],
      //           "line-width": 2,
      //         },
      //       });
      //     }
      //     popup
      //       .setLngLat(e.lngLat)
      //       .setHTML(
      //         `<div id="map-hover-popup-content">` +
      //           e.features[0].properties.name +
      //           `</div>`
      //       )
      //       .addTo(_that.map);
      //   });

      //   this.map.on("mouseleave", "sterling_edmonton", () => {
      //     if (lotId) {
      //       _that.map.setFeatureState(
      //         {
      //           source: "sterling_edmonton",
      //           id: lotId,
      //         },
      //         {
      //           hover: false,
      //         }
      //       );
      //     }
      //     lotId = null;

      //     // Reset the cursor style
      //     _that.map.getCanvas().style.cursor = "";
      //     popup.remove();
      //   });

      //   this.map.on("click", "sterling_edmonton", (e) => {
      //     console.log("event-", e.features);
      //     var selectedHome = e.features[0].properties.home
      //       ? JSON.parse(e.features[0].properties.home)
      //       : null;
      //     var propertyName = e.features[0].properties.name;
      //     if (e.features[0].properties.home) {
      //       bus.$emit("scrollTo", selectedHome.id);
      //     }
      //     console.log("lnglat", e.lngLat);

      //     this.openPopup(e.lngLat, selectedHome, propertyName);
      //     // var popupHome = new mapboxgl.Popup({
      //     //   closeButton: false,
      //     // });
      //     // popupHome
      //     //   .setLngLat(e.lngLat)
      //     //   .setHTML('<div id="map-popup-content">Hello</div>')
      //     //   .addTo(_that.map)
      //     //   .on("close", function (e) {
      //     //     console.log("close popup", e);
      //     //   });

      //     // nextTick(() => {
      //     //   console.log("nextClick");
      //     //   new Vue({
      //     //     el: "#map-popup-content",
      //     //     render: (h) =>
      //     //       h(MapPopup, {
      //     //         props: {
      //     //           home: selectedHome,
      //     //           propertyName,
      //     //         },
      //     //       }),
      //     //   });
      //     // });
      //   });

      // });
      this.map.flyTo({
        center: [community.lng, community.lat],
        zoom: 15,
      });
    },
    openPopup(lngLat, selectedHome, properties) {
      this.popupHome
        .setLngLat(lngLat)
        .setHTML('<div id="map-popup-content">Hello</div>')
        .addTo(this.map);

      // nextTick(() => {
      //   console.log("nextClick");
      new Vue({
        el: "#map-popup-content",
        render: (h) =>
          h(MapPopup, {
            props: {
              home: selectedHome,
              properties,
            },
          }),
      });
      // });
    },
    refresh(items, soldLots) {
      console.log(
        "mapcontainer refresh-",
        this.possessionFilters,
        this.communities
      );
      this.filteredItems = items;
      this.soldLots = soldLots;
      if (
        this.possessionFilters.communities.length == 1 &&
        Object.keys(this.communities).length != 0
      ) {
        var community = this.communities.filter((obj) => {
          return obj.id == this.possessionFilters.communities[0];
        })[0]
          ? this.communities.filter((obj) => {
              return obj.id == this.possessionFilters.communities[0];
            })[0]
          : {};
        console.log("possessionFilters community-", community);
        this.selectCommunity(community);
      }
      if (this.possessionFilters.communities.length != 1) {
        // this.map.removeSource("sterling_edmonton");
        var mapCenter = [-113.49848717382815, 53.54067477803275];
        this.map.flyTo({
          center: mapCenter,
          zoom: 9.6,
        });
        // if (this.map.getSource("sterling_edmonton")) {
        //   this.map.removeLayer("sterling_edmonton");
        //   if (this.map.getLayer("polygon-border"))
        //     this.map.removeLayer("polygon-border");

        // }
      }
    },
  },
};
</script>

<style lang="scss">
#mapContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  // height: 100%;
  // height: 687px;
}
.mapboxgl-canvas-container {
  height: 100vh;
}

.property-price {
  color: #00ff00;
}
.community-marker-title {
  background: white;
  padding: 3px 10px;
  border-radius: 10px;
  color: black;
}
.customBtn {
  border: 2px solid #40a9ff;
  color: #40a9ff;
}
.customBtn:hover {
  border: 2px solid #40a9ff;
  color: white;
  background: #40a9ff;
}
.customBtn.ant-btn-primary {
  color: white;
}

.mapboxgl-popup-content {
  padding: 0;
  background: none;
  box-shadow: none;
}
.mapboxgl-popup {
  max-width: 320px !important;
}
.community-marker:hover .community-marker-title {
  border: 2px solid #0075c9;
  font-weight: 600;
}
.mapboxgl-popup-close-button {
  font-size: 24px;
}
#map-hover-popup-content {
  background: white;
  padding: 5px;
  border-radius: 10px;
}
@media all and (max-width: 1050px) {
  // .page {
  //   height: calc(100vh - 50px);
  // }
  .main-container {
    .map-container {
      position: fixed !important;
      left: 0 !important;
      right: 0 !important;
      // top: 180px !important;
      bottom: 40px !important;
    }
  }
}
</style>
