<template>
  <div class="popup_content">
    <div v-if="home != null">
      <div class="image-container">
        <img class="popup_image" :src="home.medium_image" />
        <div class="sale-ribbon" v-if="home.promotion_checkbox === true">
          <img
            src="https://www.sterlingedmonton.com/wp-content/uploads/Year-End-Super-Sale-QP-overlay-image.png"
          />
        </div>
      </div>
      <div style="padding: 5px">
        <h3 v-html="home.title"></h3>
        <!-- <div>{{ home.street }}, {{ home.community_name }}</div>
        <div v-if="home.guaranted_date != ''">
          <strong>Availability: </strong
          ><span>
            {{ formatDate(home.guaranted_date) }}
          </span>
        </div>
        <div v-if="home.guaranted_date == ''">
          <strong>Availability: </strong
          ><span>
            {{ formatOnlyDate(home.completion_date) }} -
            {{ formatOnlyDate(home.end_completion_date.date) }}
          </span>
        </div> -->
        <div class="info-box">
          <div class="features">
            <div class="feature">
              <img src="../assets/home.png" alt="" width="18px" />
              {{ home.sq_ft }} sqft
            </div>
            <div class="feature">
              <img src="../assets/bed.png" alt="" width="18px" />
              {{ home.bedrooms }}
              <span
                v-if="
                  home.bedrooms_max > 0 && home.bedrooms_max > home.bedrooms
                "
                >&nbsp;- {{ home.bedrooms_max }}</span
              >
            </div>
            <div class="feature">
              <img src="../assets/bath.png" alt="" width="18px" />
              {{ home.bathrooms }}
            </div>
          </div>
        </div>
        <div class="details">
          <div class="price" v-if="price_visible">
            <div class="original-price">
              <span v-if="home.original_price != ''">
                ${{ formatMoney(home.original_price) }}
              </span>
            </div>
            <div class="home-price">${{ formatMoney(home.price) }}</div>
          </div>
          <div
            @click.stop="goPossessionPage(home.link)"
            :class="
              home.possession_date_banner == 'Move-In Ready' ||
              home.open_hour == ''
                ? 'see-details-btn bg-blue'
                : item.possession_date_banner == 'Quick Possession'
                ? 'see-details-btn bg-sky'
                : 'see-details-btn bg-light-grey'
            "
          >
            <span>VIEW DETAILS</span>
          </div>
        </div>
      </div>
      <div
        v-if="home.possession_date_banner != null"
        :class="
          home.possession_date_banner == 'Move-In Ready'
            ? 'home-status hide-mobile bg-blue'
            : home.possession_date_banner == 'Quick Possession'
            ? 'home-status hide-mobile bg-sky'
            : 'home-status hide-mobile bg-light-grey'
        "
      >
        <span style="text-transform: uppercase">{{
          home.possession_date_banner
        }}</span>
      </div>
    </div>
    <div v-else class="non-home-content">
      <div>{{ properties.name }}</div>
      <div v-if="properties.additionalType">
        <div>{{ properties.subtitle }}</div>
        <div>{{ properties.description }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "MyPopup",

  props: {
    home: {
      type: Object,
    },
    properties: {
      type: Object,
    },
  },
  data() {
    let moneyFormatter = new Intl.NumberFormat("en-US", {
      currency: "USD",
      minimumFractionDigits: 0,
    });
    return {
      moneyFormatter: moneyFormatter,
    };
  },
  methods: {
    formatDate(date) {
      // if (moment() > moment(date)) {
      if (moment(date).diff(moment(), "days") <= 30) {
        // return moment(date).diff(moment(), "days");
        return "Move In Ready!";
      } else {
        return moment(date).format("MMMM, YYYY");
      }
    },
    formatOnlyDate(date) {
      return moment(date).format("MMMM, YYYY");
    },
    formatMoney(price) {
      return this.moneyFormatter.format(price);
    },
    goPossessionPage(link) {
      document.location.href = link;
      //   bus.$emit("goPossessionPage");
    },
  },
  mounted() {
    // console.log("mappopup mounted--", this);
  },
  computed: {
    price_visible() {
      if (this.is_sold || this.is_conditional) {
        return false;
      } else return true;
    },
    is_sold() {
      return (
        this.home.sold ||
        (this.home.offer_status && this.home.offer_status === "Sold")
      );
    },
    is_conditional() {
      return this.home.offer_status && this.home.offer_status === "Conditional";
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.popup_content {
  border-radius: 20px;
  border: 0.5px solid lightgray;
  background: white;
  overflow: hidden;
  .image-container {
    position: relative;
  }
  .popup_image {
    min-width: 260px;
    width: 100%;
    height: 140px;
    object-fit: cover;
  }
  .sale-ribbon {
    position: absolute;
    top: 15px;
    right: 10px;
    transform: rotate(20deg);
    img {
      width: 80px;
      height: auto;
    }
  }
  .info-box {
    background: #fff;
    padding-top: 5px;

    .features {
      display: flex;
      justify-content: space-between;
      img {
        margin-right: 5px;
      }

      .feature {
        display: flex;
        align-items: center;
        width: 33%;
        padding: 5px;
        font-size: 11px;
        border-right: 1px solid #ddd;
        justify-content: center;

        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  .details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    background: white;

    .price {
      font-size: 18px;
      font-weight: bold;
      line-height: 20px;
      min-height: 20px;
    }
    .original-price {
      color: #666;
      font-size: 11px;
      font-weight: 400;
      text-decoration: line-through;
      vertical-align: middle;
      height: 19px;
    }
    .home-price {
      font-size: 15px;
    }

    a {
      width: 100px;
      text-align: center;
      margin-left: auto;
    }
    .see-details-btn {
      color: white;
      padding: 2px 20px;
      border-radius: 13px;
      margin-left: auto;
      font-size: 11px;
    }
  }
  .bg-blue {
    background-color: rgb(0, 117, 201);
  }
  .bg-sky {
    background: rgb(146, 192, 234);
  }
  .bg-light-grey {
    background: rgb(153, 153, 153);
  }
  .home-status {
    text-align: center;
    padding: 4px;
    color: white;
    font-size: 12px;
    border-radius: 0px 0px 20px 20px;
  }
  .non-home-content {
    padding: 5px 10px;
  }
}
</style>
