<template>
  <div class="user-badges columns">
    <div class="column user-badges-icons">
      <ul v-if="badges">
        <li v-for="badge in getBadges">
          <!-- @todo maybe there will be some different styling depending in the type -->
          <span :class="badge.type">
            <img :src="badge.image.path" :alt="badge.image.alt" :title="badge.text">
          </span>
        </li>
      </ul>
    </div>
    <div class="column user-badges-summary is-one-third">
      <div v-if="badges" >
        <span>{{badges.length}}</span>
        {{title}}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'hc-profile-badges',
    props: {
      'title': [String],
      'badges': {
        type: [Object, Array],
        default () {
          return []
        }
      }
    },
    computed: {
      getBadges () {
        return Array.isArray(this.badges) ? this.badges : [this.badges]
      }
    }
  }
</script>
<style scoped lang="scss">
.user-badges {
  width: 100%;
  padding: 10px 0 0 ;
  margin-top: 15px;

  li {
    list-style: none;
    float: left;
  }
  li:first-child {
    margin-left: 0;
  }
  li img {
    width: 35px;
    height: 35px;
  }
  .user-badges-summary {
    border-left: 1px solid #9c3;
    text-transform: uppercase;
    line-height: 19px;
    padding-left: 5px;
    font-size: 10px;
    color: #9c3;
    font-weight: normal;

    span {
      font-size: 19px;
      color: grey;
      display: block;
    }
  }
}
</style>
