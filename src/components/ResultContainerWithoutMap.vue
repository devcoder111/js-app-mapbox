<template>
  <div class="result-container result-container-without-map">
    <a-modal
      v-model="openGalleryModal"
      v-if="selectedHome"
      :title="selectedHome.title"
      centered
      width="1000px"
      :footer="null"
      @ok="openGalleryModal = false"
      class="galleryModal"
    >
      <a-row :gutter="16" class="gallery-content">
        <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
          <div class="gallery-thumbnails">
            <div
              class="gallery-thumbnail"
              v-for="(home, index) in selectedHome.gallery"
              :key="index"
            >
              <div
                :class="
                  home.medium_image == home_image
                    ? 'gallery-thumbnail-inner selected gallery-thumbnail-selected'
                    : 'gallery-thumbnail-inner'
                "
              >
                <img :src="home.medium_image" @click="goPhoto(index)" />
              </div>
            </div>
          </div>
        </a-col>
        <a-col
          :xs="{ span: 24 }"
          :lg="{ span: 18 }"
          class="gallery-main-wrapper"
        >
          <a-button
            class="nav-left"
            size="small"
            type="link"
            @click="prevPhoto()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-md"
              width="35"
              height="35"
              stroke-width="3"
              stroke="black"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <polyline points="15 6 9 12 15 18"></polyline>
            </svg>
          </a-button>
          <div>
            <transition :duration="550">
              <img
                :src="home_image"
                class="gallery-main-img"
                v-show="preview_loaded"
              />
            </transition>
          </div>
          <a-button
            class="nav-right"
            size="small"
            type="link"
            @click="nextPhoto()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-md"
              width="35"
              height="35"
              stroke-width="3"
              stroke="black"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <polyline points="9 6 15 12 9 18"></polyline>
            </svg>
          </a-button>
        </a-col>
      </a-row>
    </a-modal>
    <div class="filter-dropdown" v-if="this.$route.name !== 'home-designs'">
      <div
        class="filter-drop-btn"
        @click="showFilter = !showFilter"
        v-if="$mq != 'mobile'"
      >
        <span style="padding-right: 5px">FILTERS</span>
        <span v-show="!showFilter" style="display: flex"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="18"
            height="18"
            fill="white"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
            /></svg
        ></span>
        <span v-show="showFilter" style="display: flex"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="18"
            height="18"
            fill="white"
            viewBox="0 0 1024 1024"
          >
            <path
              d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 0 0 140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"
            /></svg
        ></span>
      </div>
      <transition :duration="550">
        <div v-show="showFilter" class="filter-content">
          <filter-container @onRefresh="onRefresh" @closeFilter="closeFilter" />
        </div>
      </transition>
    </div>
    <div class="results">
      <div class="result-toolbar" v-if="!loading">
        <div
          class="search-filter-wrapper hide-desktop"
          style="margin-top: 10px; margin-bottom: 10px; width: 100%"
        >
          <a-input
            placeholder="Search by community, model, job number"
            style="width: 75%; border: none"
            v-if="!loading"
            v-model="job_file_filter"
            class="filer-search-input"
          >
          </a-input>
          <div class="filter-btn-wrapper" @click="toggleFilters">
            <img src="../assets/filter.png" />
            <span>Filters</span>
          </div>
        </div>

        <div class="community-count-sort">
          <div style="display: flex; align-items: center">
            <span v-if="!loading" style="font-size: 18px"
              >Total: {{ visibleItems.length }} homes</span
            >
            <div
              v-if="this.$route.name == 'quick-possessions'"
              style="display: flex; justify-content: flex-start;  4px; padding: 4px; margin-left: 15px"
              class="hide-mobile"
            >
              <span style="margin-right: 10px">Hide sold homes</span>
              <a-switch
                style="margin-left: auto"
                @change="hideSoldReservedHomes"
                v-model="hideSoldHome"
              />
            </div>
          </div>
          <div
            :class="
              this.$route.name != 'home-designs'
                ? 'sort-wrapper'
                : 'sort-wrapper-model'
            "
          >
            <label class="sort-label">Sort:</label>
            <a-select
              style="width: 150px"
              v-model="order_by"
              @change="changeOrder"
            >
              <a-select-option value="most_popular" v-if="mostPopular_visible"
                >Most Popular</a-select-option
              >
              <a-select-option value="price_asc" v-if="price_visible"
                >$ Low to High</a-select-option
              >
              <a-select-option value="price_desc" v-if="price_visible"
                >$ High to Low</a-select-option
              >
              <a-select-option value="sqft_asc"
                >Sqft Low to High</a-select-option
              >
              <a-select-option value="sqft_desc"
                >Sqft High to Low</a-select-option
              >
              <a-select-option value="title_asc">A to Z</a-select-option>
              <a-select-option value="title_desc">Z to A</a-select-option>
              <a-select-option value="date_asc" v-if="move_in_date_visible"
                >Move-in Date</a-select-option
              >
            </a-select>
          </div>
        </div>
        <div class="hide-desktop" style="width: 100%">
          <div
            v-if="this.$route.name == 'quick-possessions'"
            style="display: flex; justify-content: flex-end;  4px; padding: 4px; margin-left: 15px"
          >
            <span>Hide sold homes</span>
            <a-switch
              style="margin-left: 5px"
              @change="hideSoldReservedHomes"
              v-model="hideSoldHome"
            />
          </div>
        </div>
        <div
          class="hide-mobile"
          style="
            margin-top: 10px;
            margin-bottom: 10px;
            width: 100%;
            position: relative;
          "
          v-if="is_job_file_filter_visible"
        >
          <a-input
            placeholder="Search by community, model, job number"
            style="width: 100%"
            v-if="!loading"
            v-model="job_file_filter"
            class="filer-search-input"
          >
          </a-input>
          <img src="../assets/search.png" class="search-icon" />
        </div>
      </div>

      <div
        style="
          margin-top: 10px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        "
      >
        <a-pagination
          v-model="page"
          :total="visibleItems.length"
          :default-page-size="30"
          v-if="!loading && visibleItems.length > 30"
        />
      </div>
      <div
        class="homes"
        v-if="!loading && result.length > 0 && listingStyle === 'photos'"
      >
        <template>
          <a-row :gutter="12" class="homes-list">
            <a-col
              :lg="24"
              :xl="12"
              v-for="(item, index) in paginatedVisibleItems"
              :key="index"
              class="itemwrapper"
            >
              <home-box
                :item="item"
                v-if="isVisible(item.id)"
                :key="item.id"
                @openGallery="openGallery"
                @mouseover.native="homeItemhover(item)"
              />
            </a-col>
          </a-row>
        </template>
      </div>
      <a-table
        :columns="columns"
        :data-source="paginatedVisibleItems"
        :pagination="false"
        v-if="!loading && result.length > 0 && listingStyle === 'table'"
      >
        <div slot="address" slot-scope="text, record">
          {{ text }}<br />
          <a :href="record.link">View Detail</a>
        </div>
      </a-table>
      <div style="margin-top: 10px; margin-bottom: 50px">
        <a-pagination
          v-model="page"
          :total="visibleItems.length"
          :default-page-size="30"
          v-if="!loading && visibleItems.length > 30"
        />
      </div>
      <div v-show="loading">
        <a-skeleton active avatar></a-skeleton>
        <a-skeleton active avatar></a-skeleton>
        <a-skeleton active avatar></a-skeleton>
        <a-skeleton active avatar></a-skeleton>
        <a-skeleton active avatar></a-skeleton>
        <a-skeleton active avatar></a-skeleton>
      </div>
      <div class="loading_wrapper" v-if="loading">
        <img src="../assets/home_loading.gif" />
      </div>
      <div
        class="not-found"
        v-if="loading === false && visibleItems.length === 0"
      >
        No Homes Listed? We recommend reviewing your filters by using the Filter
        button above.
      </div>
      <a-modal
        title="See new homes first (Subscribe)"
        v-model="subscribe_form_visible"
        :footer="null"
      >
        <div id="subscribe-form-container"></div>
      </a-modal>
      <a-modal
        title="Have Questions about our new homes?"
        v-model="have_question_form_visible"
        :footer="null"
      >
        <div id="have-question-form-container"></div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import HomeBox from "./HomeBox.vue";
import orderBy from "lodash/orderBy";
import moment from "moment";
import axios from "axios";
import keyBy from "lodash/keyBy";
import filter from "lodash/filter";
import startsWith from "lodash/startsWith";
import includes from "lodash/includes";
import lowerCase from "lodash/lowerCase";
import Select from "ant-design-vue/lib/select";
import ButtonGroup from "ant-design-vue/lib/button/button-group";
import Button from "ant-design-vue/lib/button";
import Table from "ant-design-vue/lib/table";
import Modal from "ant-design-vue/lib/modal";
import Pagination from "ant-design-vue/lib/pagination";
import Input from "ant-design-vue/lib/input";
import Switch from "ant-design-vue/lib/switch";
import "ant-design-vue/lib/select/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/table/style/css";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/pagination/style/css";
import "ant-design-vue/lib/switch/style/css";
import { defineComponent } from "vue";
import { HomeOutlined } from "@ant-design/icons-vue";
import FilterContainer from "../components/FilterContainer.vue";
import QuickFilter from "../components/QuickFilter.vue";
import { bus } from "../app.js";
import storejs from "store";

export default {
  components: {
    HomeOutlined,
    "filter-container": FilterContainer,
    "quick-filter": QuickFilter,
    "a-select": Select,
    "a-select-option": Select.Option,
    "a-button": Button,
    "a-button-group": ButtonGroup,
    "a-table": Table,
    "home-box": HomeBox,
    "a-modal": Modal,
    "a-pagination": Pagination,
    "a-input": Input,
    "a-switch": Switch,
  },
  data() {
    let defaultOrderBy = null;
    if (this.$route.name === "show-homes") {
      defaultOrderBy = "title_asc";
    } else if (this.$route.name === "home-designs") {
      defaultOrderBy = "most_popular";
    } else {
      defaultOrderBy = "date_asc";
    }
    return {
      preview_loaded: true,
      bodyStyle: {
        height: 80,
      },
      selectedHome: {},
      home_image: "",
      photo_index: 0,
      openGalleryModal: false,
      showFilter: false,
      page: 1,
      hideSoldHome: false,
      isJobFileFilterVisible: true,
      subscribe_form_visible: false,
      have_question_form_visible: false,
      listingStyle: "photos",
      loading: true,
      order_by: defaultOrderBy,
      job_file_filter: null,
      result: [],
      originResult: [],
      soldLots: [],
      qpsInCommunities: [],
      resultKeyValue: {},
      visibleItemIds: [],
      tableData: [],
    };
  },
  watch: {
    page() {
      this.$el.scrollIntoView();
    },
  },
  created() {
    bus.$on("scrollTo", (homeid) => {
      this.scrollTo("home-box-" + homeid);
    });
  },
  computed: {
    container_title() {
      console.log("route-", this.$route.name);
      switch (this.$route.name) {
        case "quick-possessions":
          return "Quick Possessions";
        case "home-designs":
          return "Models";
        case "show-homes":
          return "Show Homes & Self-Showing Homes";
      }
    },
    is_job_file_filter_visible() {
      return (
        this.$route.name === "quick-possessions" ||
        this.$route.name === "map-view" ||
        this.$route.name === "coming-soon"
      );
    },
    price_visible() {
      return this.$route.name === "quick-possessions";
    },
    mostPopular_visible() {
      return this.$route.name === "home-designs";
    },
    move_in_date_visible() {
      return this.$route.name === "quick-possessions";
    },
    is_coming_soon() {
      return this.$route.name === "coming-soon";
    },
    columns() {
      let moneyFormatter = new Intl.NumberFormat("en-US", {
        currency: "USD",
        minimumFractionDigits: 0,
      });
      let address = {
        title: "Address",
        dataIndex: "street",
        key: "street",
        ellipsis: true,
        scopedSlots: {
          customRender: "address",
        },
      };
      let location = {
        title: "Location",
        dataIndex: "community_name",
        key: "community_name",
        ellipsis: true,
      };
      let price = {
        title: "Price",
        dataIndex: "price",
        key: "price",
        ellipsis: true,
        sorter: (a, b) => parseInt(a.price) - parseInt(b.price),
        customRender: (text, row, index) => {
          if (text !== "") {
            return "$" + moneyFormatter.format(text);
          }
          return text;
        },
      };
      let sqft = {
        title: "Sq.Ft.",
        dataIndex: "sq_ft",
        key: "sq_ft",
        ellipsis: true,
        sorter: (a, b) => parseInt(a.sq_ft) - parseInt(b.sq_ft),
        customRender: (text, row, index) => {
          if (text !== "") {
            return moneyFormatter.format(text);
          }
          return text;
        },
      };
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        return [address, location, price, sqft];
      }
      let beds = {
        title: "Beds",
        dataIndex: "bedrooms",
        key: "bedrooms",
        ellipsis: true,
        sorter: (a, b) => parseInt(a.bedrooms) - parseInt(b.bedrooms),
      };
      let baths = {
        title: "Baths",
        dataIndex: "bathrooms",
        key: "bathrooms",
        ellipsis: true,
        sorter: (a, b) => parseInt(a.bathrooms) - parseInt(b.bathrooms),
      };
      return [address, location, price, beds, baths, sqft];
    },
    visibleItems() {
      if (this.$route.name === "home-designs") {
        return this.result;
      }
      let $this = this;
      let newResult = [];
      this.visibleItemIds.forEach((id) => {
        if ($this.resultKeyValue.hasOwnProperty(id)) {
          newResult.push($this.resultKeyValue[id]);
        }
      });
      console.log("ddd--", newResult);
      if ($this.job_file_filter == null || $this.job_file_filter === "") {
        return newResult;
      }
      var north_east = ["cy becker", "mcconachie heights"];
      var north_west = ["kinglet"];
      var south_west = [
        "crimson in creekwood chappelle",
        "the uplands at riverview",
        "edgemont east",
        "desrochers",
        "point at glenridding ravine",
        "rivers edge",
      ];
      var south_east = ["laurel crossing", "aster"];

      var NE = ["NE", "ne", "northeast", "north east"];
      var NW = ["NW", "nw", "northwest", "north west"];
      var SW = ["SW", "sw", "southwest", "south west"];
      var SE = ["SE", "se", "southeast", "south east"];
      return filter(newResult, (item) => {
        return (
          startsWith(item.job_file, $this.job_file_filter) ||
          startsWith(lowerCase(item.title), lowerCase($this.job_file_filter)) ||
          includes(
            lowerCase(item.community_name),
            lowerCase($this.job_file_filter)
          ) ||
          startsWith(
            lowerCase(item.street),
            lowerCase($this.job_file_filter)
          ) ||
          (includes(NW, lowerCase($this.job_file_filter)) &&
            includes(north_west, lowerCase(item.community_name))) ||
          (includes(NE, lowerCase($this.job_file_filter)) &&
            includes(north_east, lowerCase(item.community_name))) ||
          (includes(SW, lowerCase($this.job_file_filter)) &&
            includes(south_west, lowerCase(item.community_name))) ||
          (includes(SE, lowerCase($this.job_file_filter)) &&
            includes(south_east, lowerCase(item.community_name)))
        );
      });
    },
    paginatedVisibleItems() {
      console.log("paginatedVisibleItems");
      let index = (this.page - 1) * 30;
      return this.visibleItems.slice(index, index + 30);
    },
  },
  methods: {
    homeItemhover(item) {
      bus.$emit("homeItemhover", item.job_file);
    },
    scrollTo(id) {
      var elements = document.getElementsByClassName("item");

      // Iterate over the elements
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        // Remove the class name from each element
        element.classList.remove("active");
      }
      document.getElementById(id).scrollIntoView();
      document.getElementById(id).classList.add("active");
    },
    closeFilter() {
      this.showFilter = false;
    },
    toggleFilters() {
      this.showFilter = !this.showFilter;
      $(".filter-container").addClass("mobile-filter-container");
      console.log(
        "filter click",
        document.getElementsByClassName("lf-base-content")
      );
      $(".lf-base-content").addClass("zindex-1001");
    },
    openGallery(item) {
      this.openGalleryModal = true;
      this.selectedHome = item;
      this.home_image = item.gallery[0].medium_image;
      console.log("opengallery-", item);
    },
    goPhoto(index) {
      this.photo_index = index;
      this.setImage();
    },
    prevPhoto() {
      this.setImage();
      if (this.photo_index === 0) {
        this.photo_index = this.selectedHome.gallery.length - 1;
      }
      this.photo_index--;
    },
    nextPhoto() {
      this.setImage();
      if (this.photo_index === this.selectedHome.gallery.length - 1) {
        this.photo_index = 0;
      }
      this.photo_index++;
    },
    setImage() {
      document.querySelector(".gallery-thumbnail-selected").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      this.preview_loaded = false;
      setTimeout(() => {
        this.preview_loaded = true;
        this.home_image =
          this.selectedHome.gallery[this.photo_index].medium_image;
      }, 500);
    },
    onRefresh() {
      this.$emit("onRefresh");
    },
    showSubscribeForm() {
      this.subscribe_form_visible = true;
      $("#subscribe-form-container").html("");
      setTimeout(() => {
        hbspt.forms.create({
          cssClass: "custom-hubspot",
          portalId: "2753500",
          formId: "9aba8fca-bb7d-4c2b-85a0-11ae687981c4",
          target: "#subscribe-form-container",
        });
      }, 500);
    },
    showHaveQuestionForm() {
      this.have_question_form_visible = true;
      $("#have-question-form-container").html("");
      setTimeout(() => {
        hbspt.forms.create({
          cssClass: "custom-hubspot",
          portalId: "2753500",
          formId: "a14118b9-c138-4dd5-8ea2-d59bd93f02bc",
          target: "#have-question-form-container",
        });
      }, 500);
    },
    async refresh() {
      console.log("refresh--", this.$store.state.filter);
      let $this = this;
      this.loading = true;
      this.$emit("onLoading");
      let filterParams = {
        post_type: this.getPostType(),
        bedrooms: this.$store.state.filter.beds,
        bathrooms: this.$store.state.filter.baths,
        price_range: Array.isArray(this.$store.state.filter.price_range)
          ? this.$store.state.filter.price_range.join("-")
          : [],
        released_market: this.$store.state.filter.released_market.join("-"),
        sq_ft_range: this.$store.state.filter.home_size_range.join("-"),
        possession_date:
          this.$store.state.filter.possession_date != null
            ? moment(this.$store.state.filter.possession_date).format(
                "YYYYMMDD"
              )
            : 0,
        home_styles: this.$store.state.filter.home_types.join("-"),
        model_ids: this.$store.state.filter.hasOwnProperty("model_ids")
          ? this.$store.state.filter.model_ids.join("-")
          : "",
        community_ids: this.$store.state.filter.communities.join(","),
        features: this.$store.state.filter.features.join("-"),
        front_exposure: this.$store.state.filter.front_exposure.join("-"),
        garage_parking_spaces: this.$store.state.filter.garage_parking_spaces,
        lot_size: this.$store.state.filter.lot_size,
        lot_shape: this.$store.state.filter.lot_shape,
        lot_location: this.$store.state.filter.lot_location,
        walkout_lot: this.$store.state.filter.walkout_lot,
        colourboard: this.$store.state.filter.colourboard,
        coming_soon: this.is_coming_soon,
        is_price_reduced: this.$store.state.filter.is_price_reduced,
        is_promotion: this.$store.state.filter.is_promotion,
        is_builtgreen: this.$store.state.filter.is_builtgreen,
        is_guaranted: this.$store.state.filter.is_guaranted,
        isFourPlusBeds: this.$store.state.filter.isFourPlusBeds,
        isUnder400: this.$store.state.filter.isUnder400,
        isUnder500: this.$store.state.filter.isUnder500,
        isLegalSuite: this.$store.state.filter.isLegalSuite,
      };
      var strFilterParams = JSON.stringify(filterParams);
      var cachedResponse = await this.getCache(
        this.getPostType() + "_withoutsolds",
        filterParams
      );
      console.log("cachedResponse-", cachedResponse);

      if (cachedResponse != null) {
        setTimeout(() => {
          this.result = cachedResponse.items;
          this.originResult = cachedResponse.items;
          this.soldLots = cachedResponse.sold_lots;
          this.qpsInCommunities = cachedResponse.quick_possessions;
          $this.changeOrder();
          $this.loading = false;
          this.$emit("onLoaded");
        }, 100);
      } else {
        //without searchWithoutSoldsdata data
        axios
          .get("/wp-json/templatev2/v1/searchWithoutSoldsdata", {
            params: filterParams,
          })
          .then((response) => {
            $this.result = response.data.items;
            this.originResult = response.data.items;
            this.soldLots = response.data.sold_lots;
            this.qpsInCommunities = response.data.quick_possessions;
            $this.changeOrder();
            $this.loading = false;
            this.$emit("onLoaded");
            $this.setCache(
              this.getPostType() + "_withoutsolds",
              filterParams,
              response.data
            );
          })
          .catch((e) => {
            console.log("error", e);
          });
      }
    },
    async setCache(cacheMethod, cacheMethodParams, responseToCache) {
      console.log("setcache-", cacheMethod, cacheMethodParams, responseToCache);
      var post_type = this.getPostType();
      let _datacache = storejs.get(cacheMethod);
      if (_datacache == null || _datacache == "") {
        _datacache = [];
      }
      let _datacacheObj = _datacache;
      let newObjForCache = {
        params: JSON.stringify(cacheMethodParams),
        response: responseToCache,
        cachedDateTime: Date().toString(),
      };
      //check do we already have the record...
      for (var i = 0; i < _datacacheObj.length; i++) {
        var _record = _datacacheObj[i];
        if (_record.params == JSON.stringify(cacheMethodParams)) {
          _datacacheObj.splice(i, 1); //remove the old record....
        }
      }
      _datacacheObj.push(newObjForCache);
      let _datacacheStr = JSON.stringify(_datacacheObj);

      storejs.set(cacheMethod, _datacacheObj);
    },
    async getCache(cacheMethod, cacheMethodParams) {
      let _datacache = await storejs.get(cacheMethod);
      if (_datacache == null || _datacache == "") _datacache = [];
      let _datacacheObj = _datacache;
      console.log("_datacacheObj", _datacacheObj);
      for (var i = 0; i < _datacacheObj.length; i++) {
        var _record = _datacacheObj[i];

        if (_record.params == JSON.stringify(cacheMethodParams)) {
          let cachedDateTime = new Date(_record.cachedDateTime);
          var difference = new Date().getTime() - cachedDateTime.getTime(); // This will give difference in milliseconds
          var resultInMinutes = Math.round(difference / 60000);
          console.log("resultInMinutes-", resultInMinutes);
          if (resultInMinutes < 1440) {
            // 1day
            return _record.response;
          } else {
            console.log("too OLD");
            //we remove from the recordset and resave
            _datacacheObj.splice(i, 1);
            storejs.set(cacheMethod, name);
            return null;
          }
        }
      }
      if (_datacacheObj.length > 20) {
        store.remove(cacheMethod);

        _datacacheObj = {};
      }
      //if _datacacheObj.length>100...then clean up old data TODO
      console.log("not found");
      return null;
    },
    getPostType() {
      switch (this.$route.name) {
        case "home-designs":
          return "home-designs";
        case "show-homes":
          return "showhomes";
      }
      return "quick_possessions";
    },
    changeOrder() {
      console.log("orderby-", this.order_by);
      console.log("result-", this.result);
      if (this.order_by === "most_popular") {
        this.result = orderBy(this.result, "title", "asc");
        this.result = orderBy(this.result, "preferred_home_model", "desc");
        console.log("this.result-", this.result);
      } else if (this.order_by === "price_desc") {
        this.result = orderBy(this.result, "price", "desc");
      } else if (this.order_by === "title_asc") {
        this.result = orderBy(this.result, "title", "asc");
      } else if (this.order_by === "title_desc") {
        this.result = orderBy(this.result, "title", "desc");
      } else if (this.order_by === "date_asc") {
        this.result = orderBy(this.result, "completion_date", "asc");
      } else if (this.order_by === "sqft_asc") {
        this.result = orderBy(this.result, "sq_ft", "asc");
      } else if (this.order_by === "sqft_desc") {
        this.result = orderBy(this.result, "sq_ft", "desc");
      } else {
        this.result = orderBy(this.result, "price", "asc");
      }
      this.resultKeyValue = keyBy(this.result, "id");
      console.log("resultKeyValue-", this.resultKeyValue);
      this.$emit("onResult", this.result, this.soldLots, this.qpsInCommunities);
    },
    setVisibleItems(itemIds) {
      console.log("setVisibleItems-", itemIds);
      this.page = 1;
      this.visibleItemIds = [];
      itemIds.forEach((id) => {
        this.visibleItemIds.push(parseInt(id));
      });
    },
    isVisible(itemId) {
      return (
        this.$route.name === "home-designs" ||
        this.visibleItemIds.indexOf(parseInt(itemId)) > -1
      );
    },
    changeListingStyle(style) {
      this.listingStyle = style;
    },
    hideSoldReservedHomes(checked) {
      console.log("hideSoldReservedHomes--", checked);
      // this.$store.state.filter.is_price_reduced = checked ? true : false;
      if (checked) {
        this.result = filter(this.originResult, function (o) {
          return o.offer_status == "Available";
        });
        console.log("hidesold-result", this.result);
        // this.$emit("onResult", this.result);
        this.changeOrder();
      } else {
        // this.$emit("onResult", this.originResult);
        this.result = this.originResult;
        this.changeOrder();
      }
      // this.refresh();
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

.search-icon {
  position: absolute;
  right: 11px;
  top: 22%;
  width: 20px;
}

.filter-btn-wrapper {
  display: flex;
  border-left: 1px solid lightgrey;
  padding-left: 10px;

  img {
    width: 15px;
    height: 19px;
    margin: 0 5px;
  }
}

.gallery-thumbnail {
  .gallery-thumbnail-inner {
    border-radius: 6px;
    overflow: hidden;
  }

  .selected {
    outline: 2px solid black;
  }
}

.gtranslate_wrapper {
  display: none;
}

.subscribe-item,
.question-item {
  border-radius: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  text-align: center;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;

  h3 {
    font-size: 15px;
    height: 40px;
    margin: 0 auto;
  }

  img {
    height: 140px;
    margin: 0 auto;
  }

  a {
    margin: 0 auto;
  }
}

.subscribe-item {
}

.question-item {
}

.gtranslate_wrapper {
  display: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media all and (max-width: 500px) {
  .search-filter-wrapper {
    display: flex !important;
  }
}
</style>
