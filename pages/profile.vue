<template>
    <div>
        <div class="profile-header card">
            <img src="http://lorempixel.com/781/561/?95976">
        </div>
        <div class="columns profile-body">
            <div class="column user-sidebar">
                <box top="true" class="user-box">
                    <img src="https://randomuser.me/api/portraits/men/42.jpg" class="user-avatar">
                    <div class="user-name">Dennis Hack</div>
                    <div class="user-badges columns is-gapless">
                        <div class="column user-badges-icons">
                            <ul>
                                <li>
                                    <img width="35" height="35" src="https://cdn.frontify.com/api/screen/thumbnail/XX9MuecGg2sy_CuMKs6FulhegxuoRIqi-7nhTI65O6DOzyS6YQc2s5XIQJgeScEJjTq8puwTMSRzlVkpWRnP3A/1524">
                                </li>
                                <li>
                                    <img width="35" height="35" src="https://cdn.frontify.com/api/screen/thumbnail/hEfr-hvcLC7ZI4QVesiQeMSZ78Sxf1JupKwe26VKT50M2gZGJ7VzfANRtKXraLMoRU8IJJ1MaM2y4T40CoU4oA/1524">
                                </li>
                                <li>
                                    <img width="35" height="35" src="https://cdn.frontify.com/api/screen/thumbnail/mBlEor48pXBdaKe74aofLOVOwe9v2_9xydD254329f7KgHK3YNwhY8oA_YKcqqeC1RNZoRXot-wSA8lmA86QPg/1524">
                                </li>
                            </ul>
                        </div>
                        <div class="column user-badges-summary is-one-third">
                            <span>3</span>
                            Badges
                        </div>
                    </div>
                </box>
                <div class="hc-shortcuts">
                    <box class="shortcut-box" top="true">
                        <img src="https://cdn.frontify.com/api/screen/thumbnail/gjtyyT-91-nld9zkg6pHvZScdj53BVk0JfE8Sw6FhH9BiqTXfzYSLzzDuu8QB_aqQYMeiYMpaSQBC6WHt8DteA/1524" alt=""/>
                        <span>Message</span>
                    </box>
                    <box class="shortcut-box" top="true">
                        <img src="https://cdn.frontify.com/api/screen/thumbnail/1fqGheyFlTsQPstpdVg9SR8wfemIhyOStsyENZcKEKtMiLxld4pStcUBPSFBIKum4P5xe_ZyEY9BDGF4KyTFiA/1539" alt=""/>
                        <span>Follower</span>
                    </box>
                    <box class="shortcut-box" top="true">
                        <img src="https://cdn.frontify.com/api/screen/thumbnail/Ed0RNoWMNm8YoAQp3GScFQMGi9BNPozGyBPL4Ov-fpjh6VnBCfS6bj2PBXlAUDtpUMxuydlCPfyy4_fFvcIewQ/1524" alt=""/>
                        <span>Lesez.</span>
                    </box>
                    <box class="shortcut-box" top="true">
                        <img src="https://cdn.frontify.com/api/screen/thumbnail/j59T8yA8_NwQQdrtbqrgxYyKoKbZaVTT9zaEBOPOsRiHF4TbmlDuGrJcUYbp7OJ7z0HmFWl-rDEvGnjUJdEVDA/1524" alt=""/>
                        <span>Gallerie</span>
                    </box>
                    <box class="shortcut-box" top="true">
                        <img src="https://cdn.frontify.com/api/screen/thumbnail/zXWlGFPuTJ3QEFCh0VyZUHWeAWkBNpOZU477LcCa96jl0zCr6GJDgLrVZ-ozVxp0oipIu2k61Vz9geCvM_F6GQ/1524" alt=""/>
                        <span>Mehr</span>
                    </box>
                </div>
                <box top="true" bottom="true">
                    <hc-title>Netzwerk</hc-title>
                </box>
                <box bottom="true">
                    <hc-subtitle>Following</hc-subtitle>
                    <div class="hc-textcounters">
                        <hc-textcount class="textcountitem" count="16" text="ngo's"/>
                        <hc-textcount class="textcountitem" count="44" text="personen"/>
                        <hc-textcount class="textcountitem" count="20" text="projekte"/>
                    </div>
                    <hc-dropdown :showLabels="['Alle anzeigen','Meine anzeigen']" :sortLabels="['Sortieren nach', 'Datum', 'Kategorie']"/>
                    <div class="hc-follower-list">
                        <hc-follower-item title="item 1" timestamp="vor 3 Tagen"/>
                        <hc-follower-item title="item 2" timestamp="vor 2 Tagen"/>
                    </div>
                </box>
                <box bottom="true">
                    <hc-subtitle>Interessen</hc-subtitle>
                    <div class="hc-textcounters">
                        <hc-textcount class="textcountitem" count="14" text="lesezeichen"/>
                        <hc-textcount class="textcountitem" count="5" text="suchen"/>
                    </div>
                </box>
                <box bottom="true">
                    <hc-subtitle>Meine Karte</hc-subtitle>
                    <div class="hc-textcounters">
                        <hc-textcount class="textcountitem" count="14" text="lesezeichen"/>
                        <hc-textcount class="textcountitem" count="5" text="suchen"/>
                    </div>
                </box>
                <box>
                    <hc-subtitle>My Friends</hc-subtitle>
                    <div class="hc-textcounters">
                        <hc-textcount class="textcountitem" count="14" text="lesezeichen"/>
                        <hc-textcount class="textcountitem" count="5" text="suchen"/>
                    </div>
                </box>
            </div>
            <div class="column is-6 timeline">
                <box top="true" bottom="true">
                    <hc-title>Timeline</hc-title>
                </box>
                <div class="timeline-intro">Hallo Dennis, was sind deine Pläne für heute?
                    <hc-btn style="margin: 20px auto" class="hc-button circle success big" />
                </div>
            </div>
            <div class="column actions-sidebar">
                <box top="true" bottom="true">
                    <hc-title>Aktionen</hc-title>
                </box>
                <box>
                    <hc-subtitle>Meine Can Do's</hc-subtitle>
                    <div class="hc-textcounters">
                        <hc-textcount class="textcountitem" count="5" text="can do's"/>
                        <hc-textcount class="textcountitem" count="3" text="geschafft"/>
                    </div>
                </box>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Button from '~components/elements/Button/Button.vue'
  import Label from '~components/elements/Label/Label.vue'
  import Box from '~components/elements/Box.vue'
  import Title from '~components/elements/Title.vue'
  import Subtitle from '~components/elements/Subtitle.vue'
  import TextCount from '~components/elements/TextCount.vue'
  import Dropdown from '~components/elements/Dropdown.vue'
  import FollowerItem from '~components/hc_components/FollowerItem.vue'

  export default {
    components: {
      'hc-btn': Button,
      'lbl': Label,
      'box': Box,
      'hc-title': Title,
      'hc-subtitle': Subtitle,
      'hc-textcount': TextCount,
      'hc-dropdown': Dropdown,
      'hc-follower-item': FollowerItem
    },
    middleware: ['authenticated'],
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      })
    },
    head () {
      return {
        title: 'Profile'
      }
    }
  }
</script>

<style scoped lang="scss">
    #main {
        margin-top: 0;
    }

    .profile-header {
        width:      100%;
        height:     243px;
        max-height: 243px;
        overflow:   hidden;
        position:   relative;
        background: darkgrey;
    }

    .profile-header img {
        width:     100%;
        position:  absolute;
        left:      0;
        top:       50%;
        transform: translateY(-50%);
    }

    .profile-body {
        height:           800px;
    }

    .user-sidebar {
        min-height: 200px;

        .user-box {
            position: relative;

            .user-avatar {
                border-radius: 130px;
                width:         130px;
                height:        130px;
                position:      absolute;
                top:           0;
                left:          50%;
                transform:     translateX(-50%) translateY(-50%);
                border:        5px solid white;
            }

            .user-name {
                font-weight: bold;
                font-size:   16px;
                text-align:  center;
                padding-top: 60px;
            }

            .user-badges {
                width:   100%;
                padding: 10px 0;

                li {
                    list-style: none;
                    float:      left;
                }
                li:first-child {
                    margin-left: 0;
                }
                .user-badges-summary {
                    border-left:    1px solid #9c3;
                    text-transform: uppercase;
                    line-height:    19px;
                    padding-left:   5px;
                    font-size:      10px;
                    color:          #9c3;
                    font-weight:    normal;

                    span {
                        font-size: 19px;
                        color:     grey;
                        display:   block;
                    }
                }
            }
        }
    }

    .timeline {
        .timeline-intro {
            text-transform: uppercase;
            text-align:     center;
            color:          grey;
            padding:        10px 0;
            font-size:      14px;
            letter-spacing: 1px;

            .add-post {
                display:          block;
                margin:           10px auto;
                border:           0;
                border-radius:    50px;
                width:            50px;
                height:           50px;
                background-color: #9c3;
                box-shadow:       1px 1px 3px grey;
                font-size:        30px;
                color:            white;
                font-weight:      lighter;
            }
        }

    }

    .hc-shortcuts {
        display:         flex;
        justify-content: space-between;
        .shortcut-box {
            display:        flex;
            flex-direction: column;
            align-items:    center;
            width:          58px;

            img {
                width: 20px;
            }

            span {
                padding:        5px 0 0 0;
                font-size:      8px;
                text-transform: uppercase;
            }
        }
    }

    .hc-textcounters {
        display:         flex;
        justify-content: center;
        margin:          15px 0;

        .textcountitem {
            text-align:   center;
            border-right: 1px solid #dadada;
            //border-left: 1px solid #dadada;
            padding:      0 10px 0 10px;
        }
        .textcountitem:first-child {
            text-align: right;
        }
        .textcountitem:last-child {
            text-align:   left;
            border-right: 0;
        }
    }

    .hc-follower-list {
        margin: 15px 0;
    }
</style>
