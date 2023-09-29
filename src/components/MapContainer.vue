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
      startingLoadData: false,
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
      selectedCommunities: [],
      totalPolygons: {
        type: "FeatureCollection",
        name: "communityPolygons",
        crs: {
          type: "name",
          properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
        },
        features: [],
      },
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
      }
    });
    bus.$on("homeItemhover", (itemid) => {
      console.log("homeItemhover-", itemid);
      if (this.map.getLayer("polygon-border")) {
        this.map.setPaintProperty("polygon-border", "line-opacity", [
          "case",
          ["==", ["get", "jobfile"], itemid],
          1,
          0,
        ]);
      }
      // if (this.map.getLayer("polygon-border")) {
      //   this.map.removeLayer("polygon-border");
      // }
      // this.map.setFilter("sterling_edmonton", ["==", "jobfile", itemid]);
      // if (this.map.getSource("sterling_edmonton")) {
      //   //
      //   this.map.addLayer({
      //     id: "polygon-border",
      //     type: "line",
      //     source: "sterling_edmonton",
      //     layout: {},
      //     paint: {
      //       "line-color": "white",
      //       "line-opacity": ["case", ["==", ["get", "jobfile"], itemid], 1, 0],
      //       "line-width": 2,
      //     },
      //   });
      // }
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
    "possessionFilters.communities"(val) {
      console.log("mapcontainer-possessionfilter", this.possessionFilters);
      // This is to distinguish between possessionFilters state changes in the mapcontainer and state changes in the Filtercontainer.
      console.log("community changed", val);
      this.startingLoadData = false;
      this.onRefresh();
    },
  },
  methods: {
    backCommunities() {
      this.$store.state.filter.communities = [];
      var mapCenter = [-113.59475, 53.534637];
      this.map.flyTo({
        center: mapCenter,
        zoom: 9.5,
      });
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

      var mapCenter = [-113.59475, 53.534637];

      this.map = new mapboxgl.Map({
        container: "mapContainer",
        style: "mapbox://styles/sterlinghomes/cliebkgik001z01r970icbhmf",
        center: mapCenter,
        zoom: 9.5,
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
        var zoomLevel = this.map.getZoom();
        console.log("moveend-:", zoomLevel);
        if (zoomLevel > 14) {
          this.startingLoadData = true;
          var visibleMarkers = this.filterMarkersByBounds();
          console.log("visibleMarkers-:", visibleMarkers);
          if (
            visibleMarkers.length > 0 &&
            !this.selectedCommunities.includes(visibleMarkers[0].name)
          ) {
            console.log("selectedCommunities-:", this.selectedCommunities);
            this.$store.state.filter.communities = [visibleMarkers[0].id];
          }
        } else {
          if (this.startingLoadData) this.$store.state.filter.communities = [];
          this.startingLoadData = false;
          this.selectedCommunities = [];
        }
        // Do whatever you want with the visible markers data
      });
    },
    filterMarkersByBounds() {
      const bounds = this.map.getBounds();
      const visibleMarkers = this.communities.filter((community) => {
        return (
          community.lng >= bounds.getWest() &&
          community.lng <= bounds.getEast() &&
          community.lat >= bounds.getSouth() &&
          community.lat <= bounds.getNorth()
        );
      });
      return visibleMarkers;
    },
    removePolygonsAndUnderlay() {
      if (this.map.getSource("sterling_edmonton")) {
        this.map.removeLayer("sterling_edmonton");
        if (this.map.getLayer("polygon-border"))
          this.map.removeLayer("polygon-border");
        if (this.map.getLayer("extra-point"))
          this.map.removeLayer("extra-point");
        this.map.removeSource("sterling_edmonton");
      }
      if (this.map.getSource("overlay")) {
        this.map.removeLayer("overlay");
        this.map.removeSource("overlay");
      }
    },
    selectCommunity(community) {
      if (!this.selectedCommunities.includes(community.name))
        this.selectedCommunities.push(community.name);
      console.log("selectCommunity--", this.selectedCommunities);
      var communityShortName = community.name.replace(/\s/g, "");
      console.log("filtereditem--", this.filteredItems);
      if (this.map.getSource("sterling_edmonton")) {
        this.map.removeLayer("sterling_edmonton");
        if (this.map.getLayer("polygon-border"))
          this.map.removeLayer("polygon-border");
        if (this.map.getLayer("extra-point"))
          this.map.removeLayer("extra-point");
        this.map.removeSource("sterling_edmonton");
      }
      if (this.map.getSource("overlay")) {
        this.map.removeLayer("overlay");
        this.map.removeSource("overlay");
      }
      if (community_underlay[communityShortName]) {
        this.map.addSource("overlay", {
          type: "image",
          url: require(`../community_underlay/images/${communityShortName}.png`),
          coordinates: community_underlay[communityShortName].coordinates,
        });
        this.map.addLayer({
          id: "overlay",
          type: "raster",
          source: "overlay",
          paint: {
            "raster-fade-duration": 0,
          },
        });
      }
      import(`../mapdata/${communityShortName}.json`).then((polygons) => {
        console.log("polygons-", polygons.features[0].id);
        for (var i = 0; i < polygons.features.length; i++) {
          polygons.features[i].properties.lotId = polygons.features[i].id;
          polygons.features[i].properties.name =
            "Lot #" +
            (i + 1) +
            "--" +
            polygons.features[i].properties.Lot_Number +
            "--" +
            polygons.features[i].properties.jobfile;
          var home = [];
          if (
            polygons.features[i].properties.type &&
            polygons.features[i].properties.type == "showhome"
          )
            polygons.features[i].properties.name = "Show Home";
          else if (polygons.features[i].properties.jobfile != null) {
            home = filter(this.filteredItems, function (o) {
              return o.job_file == polygons.features[i].properties.jobfile;
            });
            if (home.length == 1) {
              polygons.features[i].properties.name = home[0].title;
              polygons.features[i].properties.status = home[0].offer_status;
            } else {
              if (polygons.features[i].properties.status == "Sold") {
                polygons.features[i].properties.name = "Sold";
              } else {
                polygons.features[i].properties.name = "Filtered Out";
                polygons.features[i].properties.status = "FilteredOut";
                var removedSoldHomes = this.soldLots.filter(
                  (e) => e.job_no == polygons.features[i].properties.jobfile
                ); //this is differet type sold homes(sold_lots post tye)
                if (removedSoldHomes.length > 0) {
                  polygons.features[i].properties.name = "Sold";
                  polygons.features[i].properties.status = "Sold";
                }
              }
            }
            polygons.features[i].properties.home = home[0];
          } else {
            polygons.features[i].properties.name = "Not Available";
            if (polygons.features[i].properties.additionalType) {
              polygons.features[i].properties.name =
                polygons.features[i].properties.title;
            }
            // polygons.features[i].properties.name = "Other Builder";
          }
          // polygons.features[i].properties.name =
          //   home.length == 1 ? home[0].title : "Not Available";
          // polygons.features[i].properties.status =
          //   home.length == 1 ? home[0].offer_status : "unknown";
        }
        console.log("polygons-", polygons);

        // Add a data source containing GeoJSON data
        this.map.addSource("sterling_edmonton", {
          type: "geojson",
          data: polygons,
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
        });
        this.map.addLayer({
          id: "polygon-border",
          type: "line",
          source: "sterling_edmonton",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "white",
            "line-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              1,
              0,
            ],
            "line-width": 2,
          },
        });

        this.map.addLayer({
          id: "extra-point",
          type: "circle",
          source: "sterling_edmonton",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
          filter: ["==", "$type", "Point"],
        });
        var _that = this;
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });

        var lotId = null;

        this.map.on("mousemove", "sterling_edmonton", function (e) {
          _that.map.getCanvas().style.cursor = "pointer";
          const feature = e.features[0];

          if (e.features.length > 0) {
            if (lotId !== null) {
              _that.map.setFeatureState(
                { source: "sterling_edmonton", id: lotId },
                { hover: false }
              );
            }
            lotId = e.features[0].id;
            _that.map.setFeatureState(
              { source: "sterling_edmonton", id: lotId },
              { hover: true }
            );
          }
          _that.map.setPaintProperty("polygon-border", "line-opacity", [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0,
          ]);
          var selectedHome = e.features[0].properties.home
            ? JSON.parse(e.features[0].properties.home)
            : null;
          var properties = e.features[0].properties;

          _that.openPopup(e.lngLat, selectedHome, properties);
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
          var properties = e.features[0].properties;
          if (e.features[0].properties.home) {
            bus.$emit("scrollTo", selectedHome.id);
          }

          this.openPopup(e.lngLat, selectedHome, properties);
        });

        //extra points layer
        this.map.on("mouseenter", "extra-point", (e) => {
          // Change the cursor style as a UI indicator.
          _that.map.getCanvas().style.cursor = "pointer";

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          var properties = e.features[0].properties;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          var selectedHome = e.features[0].properties.home
            ? JSON.parse(e.features[0].properties.home)
            : null;
          this.openPopup(coordinates, selectedHome, properties);
        });

        this.map.on("mouseleave", "extra-point", () => {
          _that.map.getCanvas().style.cursor = "";
          popup.remove();
        });
      });
      // when zoom out, don't fly
      if (!this.startingLoadData)
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
        items,
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
        if (this.map.getSource("sterling_edmonton")) {
          this.map.removeLayer("sterling_edmonton");
          if (this.map.getLayer("polygon-border"))
            this.map.removeLayer("polygon-border");
          if (this.map.getLayer("extra-point"))
            this.map.removeLayer("extra-point");
          this.map.removeSource("sterling_edmonton");
        }
        if (this.map.getSource("overlay")) {
          this.map.removeLayer("overlay");
          this.map.removeSource("overlay");
        }
        var mapCenter = [-113.49848717382815, 53.54067477803275];
        // this.map.flyTo({
        //   center: mapCenter,
        //   zoom: 9.6,
        // });
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
  padding: 3px 0;
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
