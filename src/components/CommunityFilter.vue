<template>
  <div class="filter">
    <a-button-group size="small" style="width: 100%;">
      <a-button @click="show" :disabled="loading"
        >Community
        <span v-if="communities.length > 0">({{ communities.length }})</span>
        <a-icon
          style="font-size: 11px;"
          :type="visible ? 'caret-up' : 'caret-down'"
      /></a-button>
      <a-button
        type="primary"
        :disabled="loading"
        v-if="communities.length > 0"
        @click="clear"
        ><a-icon style="font-size: 11px;" type="close-circle"
      /></a-button>
    </a-button-group>
    <a-modal v-model="visible" :maskClosable="false">
      <h3>Select Communities</h3>
      <div class="modal-content">
        <a-checkbox-group @change="onChange" v-model="selected_communities">
          <div v-for="area in areas" :key="area.id" style="padding: 20px 0;">
            <strong
              style="font-size: 15px; display: block; padding-bottom: 5px; border-bottom: 1px solid #ddd; margin-bottom: 10px;"
              ><a-checkbox :value="area.id" @change="onChangeArea">{{
                area.name
              }}</a-checkbox></strong
            >
            <a-row>
              <a-col
                v-for="community in area.communities"
                :span="12"
                :key="community.id"
                ><a-checkbox :value="community.id">{{
                  community.name
                }}</a-checkbox></a-col
              >
            </a-row>
          </div>
        </a-checkbox-group>
      </div>
      <template slot="footer">
        <a-button @click="clear">Clear</a-button>
        <a-button type="primary" @click="save">Ok</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script type="text/javascript">
import intersection from "lodash/intersection";
import Modal from "ant-design-vue/lib/modal";
import Icon from "ant-design-vue/lib/icon";
import Button from "ant-design-vue/lib/button";
import ButtonGroup from "ant-design-vue/lib/button/button-group";
import Select from "ant-design-vue/lib/select";
import Checkbox from "ant-design-vue/lib/checkbox";
import Row from "ant-design-vue/lib/row";
import Column from "ant-design-vue/lib/col";
import "ant-design-vue/lib/select/style/css";
import "ant-design-vue/lib/modal/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/checkbox/style/css";
import "ant-design-vue/lib/row/style/css";
import "ant-design-vue/lib/col/style/css";
import axios from "axios";

export default {
  components: {
    "a-icon": Icon,
    "a-modal": Modal,
    "a-button": Button,
    "a-button-group": ButtonGroup,
    "a-select": Select,
    "a-select-option": Select.Option,
    "a-checkbox": Checkbox,
    "a-row": Row,
    "a-col": Column,
    "a-checkbox-group": Checkbox.Group,
  },
  props: {
    communities: {
      type: Array,
    },
  },
  data() {
    return {
      query: null,
      visible: false,
      loading: false,
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
        beaumont: {
          id: "beaumont",
          name: "Beaumont",
          communities: {},
        },
        // 'west-edmonton': {
        //   id: 'west-edmonton',
        //   name: 'West Edmonton',
        //   communities: {}
        // }
      },
      selected_communities: [],
    };
  },
  mounted() {
    let $this = this;
    this.loading = true;
    axios.get("/wp-json/templatev2/v1/communities").then((response) => {
      this.loading = false;
      response.data.forEach((community) => {
        $this.areas[community.area].communities[community.id] = community;
      });
    });
  },
  methods: {
    show() {
      let $this = this;
      this.selected_communities = [];
      this.communities.forEach((communityId) => {
        $this.selected_communities.push(communityId);
      });
      this.visible = true;
    },
    save() {
      this.$emit("update:communities", this.selected_communities);
      this.visible = false;
      this.$parent.refresh();
    },
    clear() {
      this.selected_communities = [];
      this.$emit("update:communities", this.selected_communities);
      this.visible = false;
      this.$parent.refresh();
    },
    onChangeArea(e) {
      let $this = this;
      let area = this.areas[e.target.value];
      Object.values(area.communities).forEach((community) => {
        let index = $this.selected_communities.indexOf(community.id);
        if (e.target.checked) {
          if (index === -1) {
            $this.selected_communities.push(community.id);
          }
        } else {
          if (index > -1) {
            $this.selected_communities.splice(index, 1);
          }
        }
      });
    },
    onChange(checkedValues) {
      let $this = this;
      Object.values(this.areas).forEach((area) => {
        let communityIds = Object.keys(area.communities).map((key) => {
          return parseInt(key);
        });
        let isAreaSelected =
          intersection(checkedValues, communityIds).length ===
          communityIds.length;
        let selectedAreaIndex = checkedValues.indexOf(area.id);
        if (isAreaSelected) {
          if (selectedAreaIndex === -1) {
            $this.selected_communities.push(area.id);
          }
        } else {
          if (selectedAreaIndex > -1) {
            $this.selected_communities.splice(selectedAreaIndex, 1);
          }
        }
      });
    },
  },
};
</script>
