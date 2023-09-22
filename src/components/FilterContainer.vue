<template>
  <div class="filter-container">
    <div class="close-button">
      <a href="javascript:;" @click="closeFilters">Close</a>
    </div>
    <div class="filter-container-content">
      <a-select
        v-model="filter.communities"
        placeholder="Communities"
        style="width: 100%"
        mode="multiple"
        @change="onChange"
        :max-tag-count="communityMaxTagCount"
      >
        <a-select-opt-group v-for="area in areas" :key="area.name">
          <a-select-option
            v-for="community in area.communities"
            :key="community.id"
            :value="String(community.id)"
            @change="
              setActive({
                key: 'communities',
                name: community.name,
                value: String(community.id),
              })
            "
            >{{ community.name }}</a-select-option
          >
        </a-select-opt-group>
      </a-select>
      <div
        class="price-filter-wrapper"
        v-if="this.$route.name === 'quick-possessions'"
      >
        <div style="padding-right: 20px">
          <label>Price range:</label>
          <a-select
            v-model="filter.price_range"
            placeholder="Price Range"
            style="width: 230px"
            :max-tag-count="priceMaxTagCount"
            mode="multiple"
          >
            <a-select-option value="300000,350000">
              $300K - $350K
            </a-select-option>
            <a-select-option value="350000,400000">
              $350K - $400K
            </a-select-option>
            <a-select-option value="400000,450000">
              $400K - $450K
            </a-select-option>
            <a-select-option value="450000,500000">
              $450K - $500K
            </a-select-option>
            <a-select-option value="500000,550000">
              $500K - $550K
            </a-select-option>
            <a-select-option value="550000,600000">
              $550K - $600K
            </a-select-option>
            <a-select-option value="600000,650000">
              $600K - $650K
            </a-select-option>
            <a-select-option value="650000,5000000"> $650K+ </a-select-option>
          </a-select>
        </div>
        <div class="show-promotion-switch">
          <label>Show only promotions:</label>
          <a-switch v-model="filter.is_promotion" />
        </div>
      </div>
      <div class="possession-date-home-type">
        <div
          class="possession-date-wrapper"
          v-if="this.$route.name === 'quick-possessions'"
        >
          <a-select
            v-model="filter.released_market"
            placeholder="Possession Date"
            mode="multiple"
            :max-tag-count="possessiondateMaxTagCount"
          >
            <a-select-option value="move_in_ready">
              <div>Move-In Ready</div>
              <div style="font-size: 10px">Homes ready now</div>
            </a-select-option>
            <a-select-option value="quick_possession">
              <div>Quick Possession</div>
              <div style="font-size: 10px">Homes ready within 1-3 months</div>
            </a-select-option>
            <a-select-option value="under_construction">
              <div>Under Construction</div>
              <div style="font-size: 10px">Homes ready within 4+ months</div>
            </a-select-option>
          </a-select>
          <div style="padding: 10px 0">
            <label>Guaranteed date:</label>
            <a-switch @change="guarantedDateChanged" />
          </div>
        </div>
        <div class="hometype-wrapper">
          <div>
            <span style="display: block; width: 85px">Home Type:</span>
          </div>
          <a-checkbox-group v-model="filter.home_types">
            <div>
              <!-- <a-checkbox
                value="townhome"
                @change="
                  setActive({
                    key: 'home_types',
                    name: 'Townhomes',
                    value: 'townhome',
                  })
                "
              >
                Townhomes
              </a-checkbox> -->
              <a-checkbox
                value="laned"
                @change="
                  setActive({
                    key: 'home_types',
                    name: 'Laned Homes',
                    value: 'laned',
                  })
                "
              >
                Laned Homes
              </a-checkbox>
            </div>
            <div>
              <a-checkbox
                value="duplex"
                @change="
                  setActive({
                    key: 'home_types',
                    name: 'Duplex Homes',
                    value: 'duplex',
                  })
                "
              >
                Duplex Homes
              </a-checkbox>
              <a-checkbox
                value="sterling"
                @change="
                  setActive({
                    key: 'home_types',
                    name: 'Front Attached Home',
                    value: 'sterling',
                  })
                "
              >
                Front Attached Home
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
      <div class="hide-mobile">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-select
              v-model="filter.beds"
              style="width: 100%"
              @change="
                setActive({
                  key: 'beds',
                  name: filter.beds + '+',
                  value: filter.beds,
                })
              "
              placeholder="Bedrooms"
            >
              <a-select-option value="1">1+</a-select-option>
              <a-select-option value="2">2+</a-select-option>
              <a-select-option value="3">3+</a-select-option>
              <a-select-option value="4">4+</a-select-option>
              <a-select-option value="5">5+</a-select-option>
              <a-select-option value="6">6+</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="18">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-select
                  v-model="filter.model_ids"
                  style="width: 100%"
                  placeholder="Home Model Name"
                  mode="multiple"
                >
                  <a-select-option
                    v-for="model of models"
                    :key="model.id"
                    :value="model.id"
                    >{{ model.title }}</a-select-option
                  >
                </a-select>
              </a-col>
              <a-col :span="12">
                <div>
                  <!-- <label>Square feet:</label> -->
                  <a-select
                    v-model="filter.home_size_range"
                    style="width: 200px"
                    placeholder="Square feet"
                    :max-tag-count="priceMaxTagCount"
                    mode="multiple"
                  >
                    <a-select-option value="1000,1250">
                      1000 - 1250
                    </a-select-option>
                    <a-select-option value="1250,1500">
                      1250 - 1500
                    </a-select-option>
                    <a-select-option value="1500,1750">
                      1500 - 1750
                    </a-select-option>
                    <a-select-option value="1750,2000">
                      1750 - 2000
                    </a-select-option>
                    <a-select-option value="2000,2250">
                      2000 - 2250
                    </a-select-option>
                    <a-select-option value="2250,2500">
                      2250 - 2500
                    </a-select-option>
                    <a-select-option value="2500,5000"> 2500+ </a-select-option>
                  </a-select>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row :gutter="16" style="padding: 5px 0">
          <a-col :span="6">
            <a-select
              v-model="filter.garage_parking_spaces"
              style="width: 100%"
              placeholder="Garage"
            >
              <a-select-option value="1">1+</a-select-option>
              <a-select-option value="2">2+</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="18">
            <div class="lotdirection-wrapper">
              <div>
                <span style="padding-right: 10px">Lot direction:</span>
              </div>
              <a-checkbox-group v-model="filter.front_exposure">
                <div>
                  <a-checkbox
                    value="North"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'North',
                        value: 'North',
                      })
                    "
                  >
                    North
                  </a-checkbox>
                  <a-checkbox
                    value="Northeast"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'Northeast',
                        value: 'Northeast',
                      })
                    "
                  >
                    Northeast
                  </a-checkbox>
                </div>
                <div>
                  <a-checkbox
                    value="East"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'East',
                        value: 'East',
                      })
                    "
                  >
                    East
                  </a-checkbox>
                  <a-checkbox
                    value="Northwest"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'Northwest',
                        value: 'Northwest',
                      })
                    "
                  >
                    Northwest
                  </a-checkbox>
                </div>
                <div>
                  <a-checkbox
                    value="South"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'South',
                        value: 'South',
                      })
                    "
                  >
                    South
                  </a-checkbox>
                  <a-checkbox
                    value="Southeast"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'Southeast',
                        value: 'Southeast',
                      })
                    "
                  >
                    Southeast
                  </a-checkbox>
                </div>
                <div>
                  <a-checkbox
                    value="West"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'West',
                        value: 'West',
                      })
                    "
                  >
                    West
                  </a-checkbox>
                  <a-checkbox
                    value="Southwest"
                    @change="
                      setActive({
                        key: 'front_exposure',
                        name: 'Southwest',
                        value: 'Southwest',
                      })
                    "
                  >
                    Southwest
                  </a-checkbox>
                </div>
              </a-checkbox-group>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="hide-desktop">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-select
              v-model="filter.beds"
              placeholder="Bedrooms"
              style="width: 100%"
            >
              <a-select-option value="1">1+</a-select-option>
              <a-select-option value="2">2+</a-select-option>
              <a-select-option value="3">3+</a-select-option>
              <a-select-option value="4">4+</a-select-option>
              <a-select-option value="5">5+</a-select-option>
              <a-select-option value="6">6+</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <a-select
              v-model="filter.model_ids"
              style="width: 100%"
              placeholder="Home Model Name"
              mode="multiple"
            >
              <a-select-option
                v-for="model of models"
                :key="model.id"
                :value="model.id"
                >{{ model.title }}</a-select-option
              >
            </a-select>
          </a-col>
          <a-col :span="12">
            <a-select
              v-model="filter.garage_parking_spaces"
              style="width: 100%; padding: 10px 0"
              placeholder="Garage"
            >
              <a-select-option value="1">1+</a-select-option>
              <a-select-option value="2">2+</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <a-row>
          <div>
            <!-- <label>Square feet:</label> -->
            <a-select
              v-model="filter.home_size_range"
              style="width: 200px"
              placeholder="Square feet"
              :max-tag-count="priceMaxTagCount"
              mode="multiple"
            >
              <a-select-option value="1000,1250"> 1000 - 1250 </a-select-option>
              <a-select-option value="1250,1500"> 1250 - 1500 </a-select-option>
              <a-select-option value="1500,1750"> 1500 - 1750 </a-select-option>
              <a-select-option value="1750,2000"> 1750 - 2000 </a-select-option>
              <a-select-option value="2000,2250"> 2000 - 2250 </a-select-option>
              <a-select-option value="2250,2500"> 2250 - 2500 </a-select-option>
              <a-select-option value="2500,5000"> 2500+ </a-select-option>
            </a-select>
            <a-select v-model="square_to" style="width: 80px" placeholder="Max">
              <a-select-option value="1250"> 1250 </a-select-option>
              <a-select-option value="1500"> 1500 </a-select-option>
              <a-select-option value="1750"> 1750 </a-select-option>
              <a-select-option value="2000"> 2000 </a-select-option>
              <a-select-option value="2250"> 2250 </a-select-option>
              <a-select-option value="2500"> 2500 </a-select-option>
              <a-select-option value="+"> + </a-select-option>
            </a-select>
          </div>
        </a-row>
        <a-row>
          <div class="lotdirection-wrapper">
            <div>
              <span style="padding-right: 10px">Lot direction:</span>
            </div>
            <a-checkbox-group v-model="filter.front_exposure">
              <div>
                <a-checkbox
                  value="North"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'North',
                      value: 'North',
                    })
                  "
                >
                  North
                </a-checkbox>
                <a-checkbox
                  value="Northeast"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'Northeast',
                      value: 'Northeast',
                    })
                  "
                >
                  Northeast
                </a-checkbox>
              </div>
              <div>
                <a-checkbox
                  value="East"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'East',
                      value: 'East',
                    })
                  "
                >
                  East
                </a-checkbox>
                <a-checkbox
                  value="Northwest"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'Northwest',
                      value: 'Northwest',
                    })
                  "
                >
                  Northwest
                </a-checkbox>
              </div>
              <div>
                <a-checkbox
                  value="South"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'South',
                      value: 'South',
                    })
                  "
                >
                  South
                </a-checkbox>
                <a-checkbox
                  value="Southeast"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'Southeast',
                      value: 'Southeast',
                    })
                  "
                >
                  Southeast
                </a-checkbox>
              </div>
              <div>
                <a-checkbox
                  value="West"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'West',
                      value: 'West',
                    })
                  "
                >
                  West
                </a-checkbox>
                <a-checkbox
                  value="Southwest"
                  @change="
                    setActive({
                      key: 'front_exposure',
                      name: 'Southwest',
                      value: 'Southwest',
                    })
                  "
                >
                  Southwest
                </a-checkbox>
              </div>
            </a-checkbox-group>
          </div>
        </a-row>
      </div>
      <div class="hide-mobile">
        <a-row :gutter="16" class="features-wrapper">
          <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
            <div class="must-have-rooms-wrapper">
              <p>Must Have Rooms:</p>
              <a-checkbox-group v-model="filter.features">
                <div>
                  <a-checkbox
                    value="mudroom"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Mudroom',
                        value: 'mudroom',
                      })
                    "
                    >Mudroom</a-checkbox
                  >
                </div>
                <div>
                  <a-checkbox
                    value="flex_room"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Den',
                        value: 'flex_room',
                      })
                    "
                    >Den</a-checkbox
                  >
                </div>
                <div>
                  <a-checkbox
                    value="spice_kitchen"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Spice Kitchen',
                        value: 'spice_kitchen',
                      })
                    "
                    >Spice Kitchen</a-checkbox
                  >
                </div>
                <div>
                  <a-checkbox
                    value="bonus_room"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Bonus Room',
                        value: 'bonus_room',
                      })
                    "
                    >Bonus Room</a-checkbox
                  >
                </div>
                <div>
                  <a-checkbox
                    value="upstairs_laundry"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Upstairs Laundry',
                        value: 'upstairs_laundry',
                      })
                    "
                    >Upstairs Laundry</a-checkbox
                  >
                </div>
                <div>
                  <a-checkbox
                    value="main_bedroom"
                    @change="
                      setActive({
                        key: 'features',
                        name: 'Main Floor Bedroom',
                        value: 'main_bedroom',
                      })
                    "
                    >Main Floor Bedroom</a-checkbox
                  >
                </div>
              </a-checkbox-group>
            </div>
          </a-col>
          <a-col :xs="{ span: 24 }" :lg="{ span: 18 }" style="display: flex">
            <div class="other-have-rooms-wrapper">
              <p>Other must-haves:</p>
              <a-checkbox-group v-model="filter.features">
                <a-row>
                  <a-col :span="8">
                    <div>
                      <a-checkbox
                        value="three_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '3 Piece Ensuite',
                            value: 'three_ensuite',
                          })
                        "
                        >3 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="four_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '4 Piece Ensuite',
                            value: 'four_ensuite',
                          })
                        "
                        >4 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="five_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '5 Piece Ensuite',
                            value: 'five_ensuite',
                          })
                        "
                        >5 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="seperate_entrance"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Side Entrance',
                            value: 'seperate_entrance',
                          })
                        "
                        >Side Entrance</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="legal_suite"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Legal Suite',
                            value: 'legal_suite',
                          })
                        "
                        >Legal Suite</a-checkbox
                      >
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div>
                      <a-checkbox
                        value="finished_basement"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Finished Basement',
                            value: 'finished_basement',
                          })
                        "
                        >Finished Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="walkout"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Walkout Basement',
                            value: 'walkout',
                          })
                        "
                        >Walkout Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="open_below"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Open to below',
                            value: 'open_below',
                          })
                        "
                        >Open to below</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="condo_fees"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'No Condo Fees',
                            value: 'condo_fees',
                          })
                        "
                        >No Condo Fees</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="railings"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Railings',
                            value: 'railings',
                          })
                        "
                        >Railings</a-checkbox
                      >
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div>
                      <a-checkbox
                        value="nine_foot_main"
                        @change="
                          setActive({
                            key: 'features',
                            name: '9 Foot Main Floor',
                            value: 'nine_foot_main',
                          })
                        "
                        >9 Foot Main Floor</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="nine_foot_basement"
                        @change="
                          setActive({
                            key: 'features',
                            name: '9 Foot Basements',
                            value: 'nine_foot_basement',
                          })
                        "
                        >9 Foot Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="side_windows"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Side Windows',
                            value: 'side_windows',
                          })
                        "
                        >Side Windows</a-checkbox
                      >
                    </div>
                    <div v-if="$route.name !== 'home-designs'">
                      <a-checkbox
                        value="previous_show_homes"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Previous show home',
                            value: 'previous_show_homes',
                          })
                        "
                        >Previous show home</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="landscaping"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Includes Landscaping',
                            value: 'landscaping',
                          })
                        "
                        >Includes Landscaping</a-checkbox
                      >
                    </div>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="hide-desktop">
        <a-row :gutter="16" class="features-wrapper">
          <a-col :xs="{ span: 24 }" :lg="{ span: 6 }">
            <div class="must-have-rooms-wrapper">
              <p>Must Have Rooms:</p>
              <a-checkbox-group v-model="filter.features" style="width: 100%">
                <a-row>
                  <a-col :span="12">
                    <div>
                      <a-checkbox
                        value="mudroom"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Mudroom',
                            value: 'mudroom',
                          })
                        "
                        >Mudroom</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="flex_room"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Den',
                            value: 'flex_room',
                          })
                        "
                        >Den</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="spice_kitchen"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Spice Kitchen',
                            value: 'spice_kitchen',
                          })
                        "
                        >Spice Kitchen</a-checkbox
                      >
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div>
                      <a-checkbox
                        value="bonus_room"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Bonus Room',
                            value: 'bonus_room',
                          })
                        "
                        >Bonus Room</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="upstairs_laundry"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Upstairs Laundry',
                            value: 'upstairs_laundry',
                          })
                        "
                        >Upstairs Laundry</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="main_bedroom"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Main Floor Bedroom',
                            value: 'main_bedroom',
                          })
                        "
                        >Main Floor Bedroom</a-checkbox
                      >
                    </div>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
          </a-col>
          <a-col :xs="{ span: 24 }" :lg="{ span: 18 }" style="display: flex">
            <div class="other-have-rooms-wrapper">
              <p>Other must-haves:</p>
              <a-checkbox-group v-model="filter.features">
                <a-row>
                  <a-col :span="12">
                    <div>
                      <a-checkbox
                        value="three_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '3 Piece Ensuite',
                            value: 'three_ensuite',
                          })
                        "
                        >3 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="four_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '4 Piece Ensuite',
                            value: 'four_ensuite',
                          })
                        "
                        >4 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="five_ensuite"
                        @change="
                          setActive({
                            key: 'features',
                            name: '5 Piece Ensuite',
                            value: 'five_ensuite',
                          })
                        "
                        >5 Piece Ensuite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="seperate_entrance"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Side Entrance',
                            value: 'seperate_entrance',
                          })
                        "
                        >Side Entrance</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="legal_suite"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Legal Suite',
                            value: 'legal_suite',
                          })
                        "
                        >Legal Suite</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="finished_basement"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Finished Basement',
                            value: 'finished_basement',
                          })
                        "
                        >Finished Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="walkout"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Walkout Basement',
                            value: 'walkout',
                          })
                        "
                        >Walkout Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="open_below"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Open to below',
                            value: 'open_below',
                          })
                        "
                        >Open to below</a-checkbox
                      >
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div>
                      <a-checkbox
                        value="condo_fees"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'No Condo Fees',
                            value: 'condo_fees',
                          })
                        "
                        >No Condo Fees</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="railings"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Railings',
                            value: 'railings',
                          })
                        "
                        >Railings</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="nine_foot_main"
                        @change="
                          setActive({
                            key: 'features',
                            name: '9 Foot Main Floor',
                            value: 'nine_foot_main',
                          })
                        "
                        >9 Foot Main Floor</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="nine_foot_basement"
                        @change="
                          setActive({
                            key: 'features',
                            name: '9 Foot Basements',
                            value: 'nine_foot_basement',
                          })
                        "
                        >9 Foot Basement</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="side_windows"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Side Windows',
                            value: 'side_windows',
                          })
                        "
                        >Side Windows</a-checkbox
                      >
                    </div>
                    <div v-if="$route.name !== 'home-designs'">
                      <a-checkbox
                        value="previous_show_homes"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Previous show home',
                            value: 'previous_show_homes',
                          })
                        "
                        >Previous show home</a-checkbox
                      >
                    </div>
                    <div>
                      <a-checkbox
                        value="landscaping"
                        @change="
                          setActive({
                            key: 'features',
                            name: 'Includes Landscaping',
                            value: 'landscaping',
                          })
                        "
                        >Includes Landscaping</a-checkbox
                      >
                    </div>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
          </a-col>
        </a-row>
      </div>

      <a-row :gutter="16" style="padding: 10px 0">
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-input-number
            v-model="filter.lot_size"
            placeholder="Min. Lot Size m2"
            style="width: 100%"
          />
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-select
            v-model="filter.lot_shape"
            placeholder="Lot Shape"
            style="width: 100%"
          >
            <a-select-option value="">Any</a-select-option>
            <a-select-option value="regular">Regular</a-select-option>
            <a-select-option value="pie">Pie</a-select-option>
            <a-select-option value="reverse_pie">Reverse Pie</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-select
            v-model="filter.lot_location"
            placeholder="Lot Location"
            style="width: 100%"
          >
            <a-select-option value="">Any</a-select-option>
            <a-select-option value="corner_end_lot"
              >Corner End Lot</a-select-option
            >
            <a-select-option value="corner_end_alley"
              >Corner End Alley</a-select-option
            >
            <a-select-option value="interior">Interior</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-select
            v-model="filter.walkout_lot"
            placeholder="Walkout Lot"
            style="width: 100%"
          >
            <a-select-option value="">Any</a-select-option>
            <a-select-option value="yes">YES</a-select-option>
            <a-select-option value="no">NO</a-select-option>
            <a-select-option value="partial">Partial Walkout</a-select-option>
          </a-select>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-checkbox v-model="zero_line">Zero Lot Line</a-checkbox>
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-checkbox v-model="park_view">Park View</a-checkbox>
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }">
          <a-checkbox v-model="lake_view">Lake View</a-checkbox>
        </a-col>
        <a-col :xs="{ span: 12 }" :lg="{ span: 6 }"> </a-col>
      </a-row>
      <div class="filter-footer">
        <a class="apply-btn" @click.prevent="applyFilter">Apply</a>
        <a class="clear-btn" @click.prevent="clearAll">Clear all filters</a>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import storejs from "store";
import sortBy from "lodash/sortBy";
import intersection from "lodash/intersection";
import moment from "moment";

import axios from "axios";

import CommunityFilter from "./CommunityFilter.vue";
import HomeTypeFilter from "./HomeTypeFilter.vue";
import HomeSizeFilter from "./HomeSizeFilter.vue";
import FeaturesFilter from "./FeaturesFilter.vue";
import BedsBathsFilter from "./BedsBathsFilter.vue";
import PriceFilter from "./PriceFilter.vue";
import MyFavorites from "./MyFavorites.vue";
import MobileFilters from "./MobileFilters.vue";
import { bus } from "../app.js";
// import "ant-design-vue/lib/input/style/css";

export default {
  components: {
    "mobile-filters": MobileFilters,
    "community-filter": CommunityFilter,
    "home-type-filter": HomeTypeFilter,
    "home-size-filter": HomeSizeFilter,
    "features-filter": FeaturesFilter,
    "beds-baths-filter": BedsBathsFilter,
    "price-filter": PriceFilter,
    "my-favorites": MyFavorites,
  },
  data() {
    return {
      goPossessionPage: false,
      search: "",
      communityMaxTagCount: 4,
      possessiondateMaxTagCount: 1,
      priceMaxTagCount: 1,
      models: [],
      price_from: [],
      price_to: [],
      square_from: [],
      square_to: [],
      zero_line: false,
      park_view: false,
      lake_view: false,
      loading: true,
      active_panel_key: 0,
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
        // "west-edmonton": {
        //   id: "west-edmonton",
        //   name: "West Edmonton",
        //   communities: {},
        // },
      },
      bed_items: [
        { label: "0+", value: 0 },
        { label: "1+", value: 1 },
        { label: "2+", value: 2 },
        { label: "3+", value: 3 },
        { label: "4+", value: 4 },
        { label: "5+", value: 5 },
        { label: "6+", value: 6 },
      ],
      bath_items: [
        { label: "0+", value: 0 },
        { label: "1+", value: 1 },
        { label: "2+", value: 2 },
        { label: "3+", value: 3 },
        { label: "4+", value: 4 },
        { label: "5+", value: 5 },
        { label: "6+", value: 6 },
      ],
      home_type_items: [
        { label: "Townhomes", value: "townhome" },
        { label: "Duplex Homes", value: "duplex" },
        { label: "Laned Homes", value: "laned" },
        { label: "Front Attached Home", value: "sterling" },
      ],
      filter: {
        key: null,
        type: null,
        communities: [],
        price_range: [],
        released_market: [],
        beds: [],
        baths: 0,
        possession_date: null,
        home_size_range: [],
        home_types: [],
        model_ids: [],
        features: [],
        front_exposure: [],
        garage_parking_spaces: [],
        lot_size: "",
        lot_shape: [],
        lot_location: [],
        walkout_lot: [],
        colourboard: "",
        is_price_reduced: false,
        is_promotion: false,
        is_guaranted: 0,
        isFourPlusBeds: false,
        isUnder400: false,
        isUnder500: false,
        isLegalSuite: false,
      },
      filtersApplied: [],
      communities: [],
      community_filter_visible: true,
      price_filter_visible: true,
      beds_baths_filter_visible: false,
      possession_date_filter_visible: false,
      home_type_filter_visible: false,
      home_size_filter_visible: false,
      included_upgrades_and_options_visible: true,
      garage_information_visible: true,
      lot_features_visible: true,
      lot_direction_visible: true,
    };
  },
  watch: {
    square_from() {
      var square_range = [this.square_from + "," + this.square_to];
      this.filter.home_size_range = square_range;
    },
    square_to() {
      var square_range = [this.square_from + "," + this.square_to];
      this.filter.home_size_range = square_range;
    },
    price_from() {
      var price_range = [this.price_from + "," + this.price_to];
      this.filter.price_range = price_range;
    },
    price_to() {
      var price_range = [this.price_from + "," + this.price_to];
      this.filter.price_range = price_range;
    },
    filter: {
      handler(val, oldVal) {
        console.log("filter changed--", val, oldVal);
        //this.goPossessionPage == false this is for keeping the params when redirect to single page
        if (this.goPossessionPage == false) {
          this.$router.push({
            query: Object.assign({}, this.$route.query, {
              price_range: sortBy(this.filter.price_range).join("-"),
              released_market: sortBy(this.filter.released_market).join("-"),
              communities: sortBy(this.filter.communities).join(","),
              beds: sortBy(this.filter.beds).join(","),
              baths: this.filter.baths,
              possession_date:
                this.filter.possession_date != null
                  ? this.filter.possession_date.format().substring(0, 10)
                  : null,
              home_size_range: this.filter.home_size_range.join("-"),
              home_types: sortBy(this.filter.home_types).join(","),
              model_ids: sortBy(this.filter.model_ids).join(","),
              features: sortBy(this.filter.features).join(","),
              front_exposure: sortBy(this.filter.front_exposure).join(","),
              garage_parking_spaces: sortBy(
                this.filter.garage_parking_spaces
              ).join(","),
              lot_size: this.filter.lot_size,
              lot_shape: sortBy(this.filter.lot_shape).join(","),
              lot_location: sortBy(this.filter.lot_location).join(","),
              walkout_lot: sortBy(this.filter.walkout_lot).join(","),
              colourboard: this.filter.colourboard,
              is_price_reduced: this.filter.is_price_reduced,
              is_promotion: this.filter.is_promotion,
              is_guaranted: this.filter.is_guaranted,
            }),
          });
        }
        console.log("current route--", this.$router);
      },
      deep: true,
    },
  },
  mounted() {
    let $this = this;

    axios
      .get("/wp-json/templatev2/v1/communities")
      .then((response) => {
        $this.communities = response.data;
        console.log("$this.communities", $this.communities);
        bus.$emit("communities", $this.communities);
        response.data.forEach((community) => {
          $this.areas[community.area].communities[community.id] = community;
        });
        axios.get("/wp-json/templatev2/v1/models").then((response) => {
          $this.models = response.data;
          $this.ready();
        });
      })
      .finally(() => {
        $this.loading = false;
      });
  },
  created() {
    // this.tabs = await new appConnections().data;

    bus.$on("selectCommunity", (item) => {
      console.log("selectCommunity", item);
      this.filter.communities = [];
      this.filter.communities.push(String(item.id));
    });
    bus.$on("goPossessionPage", () => {
      console.log("goPossessionPage--");
      this.goPossessionPage = true;
    });
    bus.$on("clearAllFilters", () => {
      this.clearAll();
    });
  },
  methods: {
    applyFilter() {
      this.refresh(false);
      this.closeFilters();
    },
    setActive(element) {
      console.log("element-", element);
      console.log("this filtersapplied-", this.filtersApplied);
      console.log(
        "this.filtersApplied.includes(element, 0)",
        this.filtersApplied.includes(element)
      );
      if (
        this.filtersApplied.filter((e) => e.value == element.value).length > 0
      ) {
        // this.filtersApplied.pop(element);
        this.filtersApplied = this.filtersApplied.filter(
          (e) => e.value != element.value
        );
      } else {
        this.filtersApplied.push(element);
      }
    },
    removeTags(item) {
      console.log("filtersApplied-", this.filtersApplied);
      console.log("this.filter-", this.filter);
      this.filtersApplied = this.filtersApplied.filter(
        (e) => e.value != item.value
      );

      if (typeof this.filter[item.key] == "object") {
        this.filter[item.key].splice(
          this.filter[item.key].indexOf(item.value),
          1
        ); //remove item form array
      }
      if (typeof this.filter[item.key] == "string") {
        this.filter[item.name] = "";
      }
      if (typeof this.filter[item.key] == "boolean") {
        console.log("item.key", item.key, this.filter[item.key]);
        this.filter[item.key] = false;
        console.log("item.key-", item.key, this.filter[item.key]);
      }
    },
    activePanelChanged(key) {
      this.active_panel_key = key;
    },
    ready() {
      let $this = this;
      switch (this.$route.name) {
        case "listing":
        case "quick-possessions":
          this.beds_baths_filter_visible = true;
          this.possession_date_filter_visible = true;
          this.home_type_filter_visible = true;
          this.home_size_filter_visible = true;
          break;
        case "home-designs":
          this.beds_baths_filter_visible = true;
          this.possession_date_filter_visible = false;
          this.home_type_filter_visible = true;
          this.home_size_filter_visible = true;
          this.included_upgrades_and_options_visible = false;
          this.garage_information_visible = false;
          this.lot_features_visible = false;
          this.lot_direction_visible = false;
          break;
        case "show-homes":
          this.price_filter_visible = false;
          this.beds_baths_filter_visible = true;
          this.possession_date_filter_visible = false;
          this.home_type_filter_visible = true;
          this.home_size_filter_visible = true;
          break;
      }
      let query = this.$route.query;
      console.log("query---", query);
      let filters = {};
      if (window.hasOwnProperty("replaceQueryParams")) {
        filters = Object.assign(query, window.replaceQueryParams);
      }
      if (
        query.hasOwnProperty("price_range") &&
        query.hasOwnProperty("released_market") &&
        query.hasOwnProperty("communities") &&
        query.hasOwnProperty("beds") &&
        query.hasOwnProperty("baths") &&
        query.hasOwnProperty("possession_date") &&
        query.hasOwnProperty("home_size_range") &&
        query.hasOwnProperty("home_types") &&
        query.hasOwnProperty("features") &&
        query.hasOwnProperty("front_exposure") &&
        query.hasOwnProperty("garage_parking_spaces") &&
        query.hasOwnProperty("lot_size") &&
        query.hasOwnProperty("lot_shape") &&
        query.hasOwnProperty("lot_location") &&
        query.hasOwnProperty("walkout_lot") &&
        query.hasOwnProperty("colourboard") &&
        query.hasOwnProperty("is_promotion") &&
        query.hasOwnProperty("is_guaranted") &&
        query.hasOwnProperty("is_price_reduced")
      ) {
        filters = {
          price_range:
            query.price_range != null && query.price_range.trim().length > 0
              ? query.price_range.split("-")
              : [],
          released_market:
            query.released_market != null &&
            query.released_market.trim().length > 0
              ? query.released_market.split("-")
              : [],
          communities:
            query.communities != null && query.communities.trim().length > 0
              ? query.communities.split(",")
              : [],
          beds: query.beds == "" ? [] : query.beds,
          baths: query.baths,
          possession_date:
            query.possession_date != null &&
            query.possession_date.trim().length > 0
              ? moment(query.possession_date)
              : null,
          home_size_range:
            query.home_size_range != null &&
            query.home_size_range.trim().length > 0
              ? query.home_size_range.split("-")
              : [],
          home_types:
            query.home_types != null && query.home_types.trim().length > 0
              ? query.home_types.split(",")
              : [],
          model_ids:
            query.hasOwnProperty("model_ids") &&
            query.model_ids != null &&
            query.model_ids.trim().length > 0
              ? query.model_ids.split(",").map(Number)
              : [],
          features:
            query.features != null && query.features.trim().length > 0
              ? query.features.split(",")
              : [],
          front_exposure:
            query.front_exposure != null &&
            query.front_exposure.trim().length > 0
              ? query.front_exposure.split(",")
              : [],
          garage_parking_spaces:
            query.garage_parking_spaces != null &&
            query.garage_parking_spaces.trim().length > 0
              ? query.garage_parking_spaces.split(",")
              : [],
          lot_size: query.lot_size > 0 ? query.lot_size : "",
          lot_shape:
            query.lot_shape != null && query.lot_shape.trim().length > 0
              ? query.lot_shape.split(",")
              : [],
          lot_location:
            query.lot_location != null && query.lot_location.trim().length > 0
              ? query.lot_location.split(",")
              : [],
          walkout_lot:
            query.walkout_lot != null && query.walkout_lot.trim().length > 0
              ? query.walkout_lot.split(",")
              : [],
          colourboard: query.colourboard != null ? query.colourboard : "",
          is_price_reduced:
            query.is_price_reduced != null
              ? query.is_price_reduced == "true"
              : "",
          is_promotion:
            query.is_promotion != null ? query.is_promotion == "true" : "",
          is_guaranted: query.is_guaranted != null ? query.is_guaranted : "",
        };

        this.price_from =
          query.price_range == "" ? [] : query.price_range.split(",")[0];
        this.price_to =
          query.price_range == "" ? [] : query.price_range.split(",")[1];
        this.square_from =
          query.home_size_range == ""
            ? []
            : query.home_size_range.split(",")[0];
        this.square_to =
          query.home_size_range == ""
            ? []
            : query.home_size_range.split(",")[1];
        console.log("square_from-", this.square_from, this.square_to);
      } else {
        filters = storejs.get(this.$route.name + "_filter");
        console.log("no fileters", filters);
      }
      this.$store
        .dispatch("loadFilter", filters != null ? filters : this.filter)
        .then(() => {
          $this.filter = $this.$store.state.filter;
          $this.refresh(false);
          $this.filtersApplied = [];
          var that = $this;
          console.log("this.filter-", $this.filter);
          $.each($this.filter, function (key, value) {
            if (
              typeof value == "object" &&
              value != null &&
              value.length != 0
            ) {
              value.forEach(function (e) {
                var tempVal = e;
                console.log("communities", that.communities);
                if (key == "communities") {
                  var filteredCommunities = that.communities.filter(
                    (el) => el.id == e
                  );
                  var tempVal = filteredCommunities
                    ? filteredCommunities[0].name
                    : e;
                }
                // if (tempVal == "sterling") tempVal = "Front Attached Home";
                if (key == "home_types") {
                  var temp = $this.home_type_items.filter(
                    (e) => e.value == tempVal
                  );
                  tempVal = temp[0].label;
                }
                that.filtersApplied.push({
                  key: key,
                  name: tempVal,
                  value: e,
                });
              });
            }
            if (key == "is_price_reduced" && value == true) {
              that.filtersApplied.push({
                key: key,
                name: "Price Reduced",
                value: "price_reduced",
              });
            }
            if (key == "is_promotion" && value == true) {
              that.filtersApplied.push({
                key: key,
                name: "Promotion",
                value: "promotion",
              });
            } else if (
              typeof value == "string" &&
              value != "" &&
              value != 0 &&
              key != "type" &&
              key != "is_guaranted"
            ) {
              that.filtersApplied.push({
                key: key,
                name: value,
                value: value,
              });
            }
          });
        });
      $(window).on("unload", function () {
        console.log("window unload");
        $this.filter.key = $this.filterKey;
        $this.filter.type = $this.$route.name;
        $this.filter.communities = [];
        $this.filter.price_range = [];
        $this.filter.released_market = [];
        $this.filter.beds = [];
        $this.filter.baths = 0;
        $this.filter.possession_date = null;
        $this.filter.home_size_range = [];
        $this.filter.home_types = [];
        $this.filter.model_ids = [];
        $this.filter.features = [];
        $this.filter.front_exposure = [];
        $this.filter.garage_parking_spaces = [];
        $this.filter.lot_size = "";
        $this.filter.lot_shape = [];
        $this.filter.lot_location = [];
        $this.filter.walkout_lot = [];
        $this.filter.colourboard = "";
        $this.filter.is_promotion = false;
        $this.filter.is_guaranted = 0;
        $this.filter.is_price_reduced = false;
        $this.$store.dispatch("saveFilter", {
          routeName: "quick-possessions",
          filter: $this.filter,
        });
        $this.$store.dispatch("saveFilter", {
          routeName: "home-designs",
          filter: $this.filter,
        });
        $this.$store.dispatch("saveFilter", {
          routeName: "show-homes",
          filter: $this.filter,
        });

        return null;
      });
    },
    saveFilters() {
      this.$store.dispatch("addSavedFilter");
      $(".filter-container").removeClass("mobile-filter-container");
      $(".lf-base-content").removeClass("zindex-1001");
    },
    refresh(save = true) {
      console.log("filter container refresh-", this.filter);
      console.log("this.filterKey-", this.filterKey, this.$route.name);
      this.filter.key = this.filterKey;
      this.filter.type = this.$route.name;
      if (save) {
        this.$store
          .dispatch("saveFilter", {
            routeName: this.$route.name,
            filter: this.filter,
          })
          .then(() => {
            this.$emit("onRefresh");
          });
      } else {
        this.$emit("onRefresh");
      }
      $(".filter-container").removeClass("mobile-filter-container");
      $(".lf-base-content").removeClass("zindex-1001");
      // this.$emit("closeFilter");
    },
    clearAll() {
      this.filter.communities = [];
      this.filter.price_range = [];
      this.filter.released_market = [];
      this.filter.beds = [];
      this.filter.baths = 0;
      this.filter.possession_date = null;
      this.filter.home_size_range = [];
      this.filter.home_types = [];
      this.filter.model_ids = [];
      this.filter.features = [];
      this.filter.front_exposure = [];
      this.filter.garage_parking_spaces = [];
      this.filter.lot_size = "";
      this.filter.lot_shape = [];
      this.filter.lot_location = [];
      this.filter.walkout_lot = [];
      this.filter.colourboard = "";
      this.filter.is_promotion = false;
      this.filter.is_guaranted = 0;
      this.filter.is_price_reduced = false;
      this.filtersApplied = [];
      this.refresh();
      $(".filter-container").removeClass("mobile-filter-container");
      $(".lf-base-content").removeClass("zindex-1001");
    },
    disabledDate(date) {
      return moment() > date;
    },
    onChangeArea(e) {
      let $this = this;
      let area = this.areas[e.target.value];
      console.log("area-", e.target.value, area);
      Object.values(area.communities).forEach((community) => {
        let index = $this.filter.communities.indexOf(community.id);
        if (e.target.checked) {
          if (index === -1) {
            $this.filter.communities.push(community.id);
          }
        } else {
          if (index > -1) {
            $this.filter.communities.splice(index, 1);
          }
        }
      });
      this.setActive({
        key: area.id,
        name: area.name,
        value: area.name,
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
            $this.filter.communities.push(area.id);
          }
        } else {
          if (selectedAreaIndex > -1) {
            $this.filter.communities.splice(selectedAreaIndex, 1);
          }
        }
      });
    },
    closeFilters() {
      $(".filter-container").removeClass("mobile-filter-container");
      $(".lf-base-content").removeClass("zindex-1001");
      this.$emit("closeFilter");
    },
    priceReducedStatusChanged(checked) {
      console.log("priceReducedStatusChanged", checked);
      // this.filter.is_price_reduced = checked ? 1 : 0;
      this.setActive({
        key: "is_price_reduced",
        name: "Price Reduced",
        value: "price_reduced",
      });
    },
    promotionStatusChanged(checked) {
      // this.filter.is_promotion = checked ? 1 : 0;
      this.setActive({
        key: "is_promotion",
        name: "Promotion",
        value: "promotion",
      });
    },
    guarantedDateChanged(checked) {
      this.filter.is_guaranted = checked ? 1 : 0;
    },
  },
};
</script>
<style>
.ant-input,
.ant-select-selection,
.ant-input-number {
  border-radius: 20px;
}
.sort-wrapper .ant-select-selection {
  border: none;
  display: flex;
  align-items: center;
  justify-content: end;
}
.sort-wrapper .ant-select-arrow {
  color: black;
}
.sort-wrapper .ant-select-selection__rendered {
  font-weight: bold;
}
.filter-divider .ant-divider-horizontal {
  min-width: 70%;
  width: 70%;
  margin: 24px auto;
}
.ant-select-dropdown {
  z-index: 11111;
}
</style>
<style lang="scss" scoped>
.price-filter-wrapper {
  padding: 5px 0px;
  display: flex;
  align-items: center;
}
.filter-container-content {
  margin-top: 15px;
}

.possession-date-home-type {
  padding: 5px 0px;
  display: flex;
}
.hometype-wrapper {
  display: flex;
  margin-left: 15px;
  padding: 10px 0;
  .ant-checkbox-group {
    display: flex;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
}
.lotdirection-wrapper {
  display: flex;
  padding: 10px 0;
  .ant-checkbox-group {
    display: flex;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    margin-left: 0;
  }
}
.must-have-rooms-wrapper {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 10px;
}
.other-have-rooms-wrapper {
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 20px;
  padding: 10px;
  width: 100%;
  .ant-checkbox-group {
    width: 100%;
  }
}
.clear-btn {
  text-decoration-line: underline;
  color: #616466;
}
.apply-btn {
  text-decoration: none;
  color: white;
  background: #5dadff;
  padding: 2px 20px;
  border-radius: 20px;
  margin-right: 10px;
}
.apply-btn:hover {
  background: #3178c1;
}
.filter-footer {
  float: right;
}
span.ant-input-suffix {
  background-color: #ffa;
}
input {
  border-radius: 20px !important;
}
.modal-content {
  padding: 10px;
}

.b-applied_filters-items {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 8px;
  flex-wrap: wrap;
}
.b-applied_filters-item {
  background-color: #f8f8f8;
  // height: 30px;
  align-items: center;
  border: 1px solid #ddd;
  display: inline-flex;
  margin: 0 12px 12px 0;
  overflow: hidden;
  padding: 0 0 0 10px;
  -webkit-user-select: none;
  user-select: none;
}
.b-applied_filters-name {
  display: none;
  margin-right: 10px;
}
.b-applied_filters-value {
  margin-right: 10px;
  text-transform: capitalize;
}
.b-applied_filters-remove_button {
  align-items: center;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  text-align: center;
  width: 40px;
  background-color: #fff;
  height: 28px;
  width: 28px;
}
.b-applied_filters-remove_button::before {
  height: 14px;
  width: 14px;
  background: var(--icon-color, currentColor);
  content: "";
  display: inline-block;
  height: 16px;
  -webkit-mask: url(https://www.sterlingedmonton.com/wp-content/uploads/sprite-common.svg#closeSmall);
  mask: url(https://www.sterlingedmonton.com/wp-content/uploads/sprite-common.svg#closeSmall);
  -webkit-mask-position: 50%;
  mask-position: 50%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100%;
  mask-size: 100%;
  width: 16px;
}
.possession-date-wrapper {
  .ant-select {
    width: 280px;
  }
}
.features-wrapper {
  padding: 0px 0;
  display: flex;
}
@media all and (max-width: 700px) {
  .price-filter-wrapper {
    display: block;
    .show-promotion-switch {
      padding: 10px 0;
    }
  }
  .filter-container-content {
    margin-top: 40px;
    margin-bottom: 80px;
  }
  .possession-date-home-type {
    display: block;
  }
  .possession-date-wrapper {
    display: flex;
    align-items: center;
    .ant-select {
      width: 50%;
      padding-right: 10px;
    }
  }
  .features-wrapper {
    padding: 20px 0;
    display: block;
  }
  .must-have-rooms-wrapper {
    border: none;
  }
  .other-have-rooms-wrapper {
    border: none;
  }
  .lotdirection-wrapper {
    .ant-checkbox-group {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
