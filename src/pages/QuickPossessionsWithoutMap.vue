<template>
  <div class="page">
    <div class="banner_wrapper" :hidden="isMobile && mode == 'map'">
      <img src="../assets/banner.png" alt="Banner" class="banner_img" />
      <h2 class="banner_title">Quick Possessions</h2>
      <quick-filter @onRefresh="onRefresh" />
    </div>
    <div class="main-container main-container-without-map">
      <a-row>
        <a-col :lg="24" :xl="18">
          <result-container
            ref="resultContainer"
            @onLoading="onLoading"
            @onLoaded="onLoaded"
            @onResult="onResult"
            @onRefresh="onRefresh"
          />
        </a-col>
        <a-col :lg="24" :xl="6">
          <div class="send-msg-form">
            <a-row type="flex" justify="center" align="middle">
              <a-col :span="8">
                <img
                  src="https://www.sterlingedmonton.com/wp-content/uploads/Sterling-Homes-Black-Grey-Qualico-Company-.png"
                  class="contracter-img"
                />
              </a-col>
              <a-col :span="16">
                <div class="send-msg-form-header font-bold">
                  <div style="font-size: 20px">Talk to our team of experts</div>
                  <div style="font-size: 16px">
                    <a href="tel:780-800-7594">780-800-7594</a>
                  </div>
                </div>
              </a-col>
            </a-row>
            <p class="font-bold" style="padding-top: 5px">
              Our team is happy to provide current offers or more details.
              Please fill out this form and we'll be in touch right away.
            </p>
            <a-input
              placeholder="Email"
              style="width: 100%; margin-bottom: 10px"
              v-model="form_email"
              class="form_email"
            >
            </a-input>
            <a-textarea
              v-model="form_msg"
              placeholder="Ask us a question"
              :rows="4"
            />

            <a class="send-msg-btn" @click.prevent="sendMessage"
              >Send Message</a
            >
            <div v-if="success_msg != ''" class="blue-text">
              {{ success_msg }}
            </div>
            <div class="font-bold">Talk to a real person</div>
            <div class="color-gray">
              Your message isn't going to the inbox abyss, never to be seen or
              heard of again. At Sterling Homes, we provide the exceptional
              service we'd want to experience ourselves.
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- <map-container
          ref="mapContainer"
          @onVisibleItems="onVisibleItems"
          @onRefresh="onRefresh"
          :loading="loading"
          v-show="!isMobile || (isMobile && mode == 'map')"
        /> -->
      <!-- <map-container ref="mapContainer" @onRefresh="onRefresh" /> -->
    </div>
    <a-modal
      v-model="openMessageModal"
      title="Send Message"
      centered
      width="600px"
      :footer="null"
      @ok="openMessageModal = false"
      class="sendMessageModal"
    >
      <div id="sendMessageHubspot"></div>
    </a-modal>
  </div>
</template>

<script type="text/javascript">
import axios from "axios";
import Button from "ant-design-vue/lib/button";
import "ant-design-vue/lib/button/style/css";
import keyBy from "lodash/keyBy";
import map from "lodash/map";
import FilterContainer from "../components/FilterContainer.vue";
import ResultContainer from "../components/ResultContainerWithoutMap.vue";
import QuickFilter from "../components/QuickFilter.vue";
import MapContainer from "../components/MapContainer.vue";
import Icon from "ant-design-vue/lib/icon";
import { bus } from "../app.js";
import intersection from "lodash/intersection";

export default {
  components: {
    "filter-container": FilterContainer,
    "result-container": ResultContainer,
    "map-container": MapContainer,
    "quick-filter": QuickFilter,
    "a-button": Button,
    "a-icon": Icon,
  },
  data() {
    return {
      success_msg: "",
      openMessageModal: false,
      form_msg: "",
      form_email: "",
      resizeEventFunction: null,
      offsetTop: 0,
      mode: "list",
      loading: true,
      job_file_filter: null,
      mounted: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    isMobile() {
      return this.windowWidth < 768;
    },
  },
  mounted() {
    let $this = this;
    console.log("quick possession mounted");
    document.title =
      "New Quick Possession Homes For Sale Edmonton | Find New Homes In Edmonton | Sterling Homes";
    this.resizeEventFunction = function () {
      $this.updateMarginTop();
    };
    $this.updateMarginTop();
    window.addEventListener("resize", this.resizeEventFunction);
    this.mounted = true;
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    // axios.get("/wp-json/templatev2/v1/communities").then((response) => {
    //   $this.loading = false;
    //   $this.$refs.mapContainer.refreshCommunityMarkers(response.data);
    // });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEventFunction);
  },

  methods: {
    getCookie(cname) {
      var name = cname + "=";
      console.log("cookie-", document.cookie);
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },
    sendMessage() {
      // this.openMessageModal = true;
      // const script = document.createElement("script");
      // script.src = "https://js.hsforms.net/forms/v2.js";
      // document.body.appendChild(script);
      // script.addEventListener("load", () => {
      //   if (window.hbspt) {
      //     window.hbspt.forms.create({
      //       portalId: "2753500",
      //       formId: "221c2495-1f6b-43ad-9ec4-c9aab2e5fa54",
      //       target: "#sendMessageHubspot",
      //     });
      //   }
      // });
      var hubspotCookie = this.$cookies.get("hubspotutk");
      var pageUri = window.location.origin + "/#" + this.$route.fullPath;
      var pageName = "quick-possessions";
      console.log("route-", hubspotCookie);
      var form_data = {
        email: this.form_email,
        message: this.form_msg,
        hutk: hubspotCookie,
        pageUri,
        pageName,
      };
      var params = new URLSearchParams();
      params.append("email", this.form_email);
      params.append("message", this.form_msg);
      params.append("hutk", hubspotCookie);
      params.append("pageUri", pageUri);
      params.append("pageName", pageName);

      console.log("form_data-", form_data);
      this.success_msg = "";
      axios
        .post("/wp-json/hubspot/inventorySendMessageForm", params)
        .then((response) => {
          console.log("inventorySendMessageForm-", response);
          var res = JSON.parse(response.data);
          this.form_email = "";
          this.form_msg = "";
          if (res.status == "error") this.success_msg = res.message;
          else
            this.success_msg =
              "Your message has been sent successfully! A member of our team will connect with you shortly.";
        });
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    updateMarginTop() {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return;
      }
      let doc = document.documentElement;
      let mainContainer = document.getElementsByClassName("main-container")[0];
      console.log("fff", doc.offsetHeight, mainContainer.offsetTop);
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
    onRefresh() {
      this.$refs.resultContainer.refresh();
    },
    onResult(items, soldLots) {
      console.log("onResult");
      var itemIds = map(items, "id");
      this.$refs.resultContainer.setVisibleItems(itemIds);
      // let style = window.getComputedStyle(
      //   document.getElementsByClassName("map-container")[0]
      // );
      // var itemIds = map(items, "id");
      // if (style.display === "none") {
      //   // console.log("onresult-quickpossession", items);
      //   // let itemIds = Object.keys(keyBy(items, "id"));
      //   // console.log("onresult-quickpossession-itemids", itemIds);

      //   this.$refs.resultContainer.setVisibleItems(itemIds);
      // } else {
      //   // this.$refs.mapContainer.refreshMarkers(items);
      //   this.$refs.mapContainer.refresh(items, soldLots);
      //   this.$refs.resultContainer.setVisibleItems(itemIds);
      // }
    },
    onVisibleItems(itemIds) {
      this.$refs.resultContainer.setVisibleItems(itemIds);
    },
    toggleFilters() {
      $(".filter-container").addClass("mobile-filter-container");
      console.log(
        "filter click",
        document.getElementsByClassName("lf-base-content")
      );
      $(".lf-base-content").addClass("zindex-1001");
    },
    toggleMap() {
      this.mode = this.mode === "list" ? "map" : "list";

      // $(".map-container").toggle();
      // $(".result-container").toggle();
      if (this.mode == "map") {
        setTimeout(() => {
          console.log("ddd");
          // this.$refs.mapContainer.resize();
        }, 100);
        // this.$refs.resultContainer.refresh();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-filter-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  padding: 3px 0;
  align-items: center;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
}
.filter-btn-wrapper {
  display: flex;
  border-left: 1px solid lightgrey;
  padding: 0 10px;
  img {
    width: 15px;
    height: 19px;
    margin: 0 5px;
  }
}
.main-container .filter-container {
  display: none;
}
@media all and (max-width: 500px) {
  .search-filter-wrapper {
    display: flex !important;
  }
}
</style>
