import Vue from "vue";
import Vuex from "vuex";
import VueMq from "vue-mq";
import VueRouter from "vue-router";
import VueLazyLoad from "vue-lazyload";
import { Button } from "ant-design-vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueCookies from "vue-cookies";
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Button);
Vue.use(Antd);
Vue.use(VueLazyLoad, {
  loading: "/dist/loading.gif",
});
Vue.use(VueCookies, { expires: "7d" });
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 1050,
    desktop: Infinity,
  },
  defaultBreakpoint: "desktop",
});

import storejs from "store";
import storejsEventsPlugin from "store/plugins/events";
storejs.addPlugin(storejsEventsPlugin);
import "./reset.css";
import App from "./App.vue";

let redirect = "/quick-possessions";
if (window.hasOwnProperty("redirectApp")) {
  redirect = window.redirectApp;
}
export const bus = new Vue();
const router = new VueRouter({
  routes: [
    { path: "/", redirect: { path: redirect } },
    {
      path: "/quick-possessions",
      component: () => import("./pages/QuickPossessionsWithoutMap.vue"),
      name: "quick-possessions",
    },
    {
      path: "/map-view",
      component: () => import("./pages/QuickPossessions.vue"),
      name: "quick-possessions-map",
    },
    {
      path: "/coming-soon",
      component: () => import("./pages/ComingSoon.vue"),
      name: "coming-soon",
    },
    {
      path: "/home-designs",
      component: () => import("./pages/Models.vue"),
      name: "home-designs",
    },
    {
      path: "/showhomes",
      component: () => import("./pages/ShowHomes.vue"),
      name: "show-homes",
    },
    {
      path: "/communities",
      component: () => import("./pages/Communities.vue"),
      name: "communities",
    },
    { path: "*", component: () => import("./pages/PageNotFound.vue") },
  ],
});

let loadingElement = document.getElementById("app-loading");
loadingElement.parentNode.removeChild(loadingElement);
document.getElementById("app").style.display = "block";

// IE - Object assign polyfill
if (typeof Object.assign != "function") {
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    "use strict";
    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError("Cannot convert undefined or null to object");
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

const store = new Vuex.Store({
  state: {
    favorites: {},
    community_favorites: {},
    saved_filters: {},
    default_filter_keys: [
      "home-designs94ffb1bd68dc830873357df1bbcbfd8c",
      "quick-possessions94ffb1bd68dc830873357df1bbcbfd8c",
      "show-homes94ffb1bd68dc830873357df1bbcbfd8c",
    ],
    filter: {
      key: "",
      type: "",
      model_ids: [],
      price_range: [],
      communities: [],
      beds: "",
      baths: 0,
      home_types: [],
      home_size_range: [],
      possession_date: null,
      features: [],
      front_exposure: [],
      garage_parking_spaces: [],
      lot_size: 0,
      lot_shape: [],
      lot_location: [],
      walkout_lot: [],
      colourboard: "",
      isFourPlusBeds: false,
      isUnder400: false,
      isUnder500: false,
      isLegalSuite: false,
    },
  },
  mutations: {
    loadCommunityFavorites(state, items) {
      state.community_favorites = items;
    },
    toggleCommunityFavorite(state, item) {
      if (state.community_favorites.hasOwnProperty(item.id)) {
        Vue.delete(state.community_favorites, item.id);
      } else {
        Vue.set(state.community_favorites, item.id, item);
      }
      storejs.set("favorite_communities_v5", state.community_favorites);
    },
    loadFavorites(state, items) {
      state.favorites = items;
    },
    toggleFavorite(state, item) {
      if (state.favorites.hasOwnProperty(item.id)) {
        Vue.delete(state.favorites, item.id);
      } else {
        Vue.set(state.favorites, item.id, item);
      }
      storejs.set("favorite_homes_v5", state.favorites);
    },
    loadSavedFilters(state, items) {
      state.saved_filters = items;
    },
    addSavedFilter(state) {
      Vue.set(state.saved_filters, state.filter.key, {
        key: state.filter.key,
        type: state.filter.type,
        price_range: state.filter.price_range,
        communities: state.filter.communities,
        beds: state.filter.beds,
        baths: state.filter.baths,
        home_types: state.filter.home_types,
        model_ids: state.filter.hasOwnProperty("model_ids")
          ? state.filter.model_ids
          : [],
        home_size_range: state.filter.home_size_range,
        possession_date: state.filter.possession_date,
        features: state.filter.features,
        front_exposure: state.filter.front_exposure,
        garage_parking_spaces: state.filter.garage_parking_spaces,
        lot_size: state.filter.lot_size,
        lot_shape: state.filter.lot_shape,
        lot_location: state.filter.lot_location,
        walkout_lot: state.filter.walkout_lot,
        colourboard: state.filter.colourboard,
      });
      storejs.set("saved_filters_v5", state.saved_filters);
    },
    removeSavedFilter(state, key) {
      Vue.delete(state.saved_filters, key);
      storejs.set("saved_filters_v5", state.saved_filters);
    },
    loadFilter(state, filter) {
      state.filter = filter;
    },
    saveFilter(state, object) {
      state.filter = object.filter;
      storejs.set(object.routeName + "_filter", state.filter);
    },
  },
  actions: {
    loadCommunityFavorites(context, items) {
      if (items != null) {
        context.commit("loadCommunityFavorites", items);
      }
    },
    toggleCommunityFavorite(context, item) {
      item.is_favorited = !context.state.community_favorites.hasOwnProperty(
        item.id
      );
      context.commit("toggleCommunityFavorite", item);
    },
    loadFavorites(context, items) {
      if (items != null) {
        context.commit("loadFavorites", items);
      }
    },
    toggleFavorite(context, item) {
      item.is_favorited = !context.state.favorites.hasOwnProperty(item.id);
      context.commit("toggleFavorite", item);
    },
    loadSavedFilters(context, items) {
      if (items != null) {
        context.commit("loadSavedFilters", items);
      }
    },
    addSavedFilter(context) {
      context.commit("addSavedFilter");
    },
    removeSavedFilter(context, key) {
      context.commit("removeSavedFilter", key);
    },
    loadFilter(context, filter) {
      if (filter != null) {
        context.commit("loadFilter", filter);
      }
    },
    saveFilter(context, object) {
      context.commit("saveFilter", object);
    },
  },
});

// firebase.auth().onAuthStateChanged(function (user) {
//   if (user) {
//     let userRef = firebase.firestore().collection("users").doc(user.uid);
//     userRef.onSnapshot((doc) => {
//       let data = doc.data();
//       if (data == null) {
//         userRef.set(
//           {
//             favorite_homes_v5: JSON.stringify({}),
//             favorite_communities_v5: JSON.stringify({}),
//             saved_filters_v5: JSON.stringify({}),
//           },
//           { merge: true }
//         );
//       } else {
//         if (data != null && data.hasOwnProperty("favorite_communities_v5")) {
//           store.dispatch(
//             "loadCommunityFavorites",
//             JSON.parse(data.favorite_communities_v5)
//           );
//         }
//         if (data != null && data.hasOwnProperty("favorite_homes_v5")) {
//           store.dispatch("loadFavorites", JSON.parse(data.favorite_homes_v5));
//         }
//         if (data != null && data.hasOwnProperty("saved_filters_v5")) {
//           store.dispatch("loadSavedFilters", JSON.parse(data.saved_filters_v5));
//         }
//       }
//     });
//     storejs.watch("favorite_homes_v5", function (newValue, oldValue) {
//       userRef.set(
//         { favorite_homes_v5: JSON.stringify(newValue) },
//         { merge: true }
//       );
//     });
//     storejs.watch("favorite_communities_v5", function (newValue, oldValue) {
//       userRef.set(
//         { favorite_communities_v5: JSON.stringify(newValue) },
//         { merge: true }
//       );
//     });
//     storejs.watch("saved_filters_v5", function (newValue, oldValue) {
//       userRef.set(
//         { saved_filters_v5: JSON.stringify(newValue) },
//         { merge: true }
//       );
//     });
//   } else {
//     store.dispatch(
//       "loadCommunityFavorites",
//       storejs.get("favorite_communities_v5")
//     );
//     store.dispatch("loadFavorites", storejs.get("favorite_homes_v5"));
//     store.dispatch("loadSavedFilters", storejs.get("saved_filters_v5"));
//   }
// });

var outside_event = "";
Vue.directive("click-outside", {
  bind: function (el, binding, vnode) {
    outside_event = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", outside_event);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", outside_event);
  },
});

new Vue({
  el: "#app",
  store,
  router,
  render: (h) => h(App),
});
