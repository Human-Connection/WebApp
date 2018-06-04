<template>
  <div class="user-badges columns is-mobile">
    <div class="column user-badges-icons">
      <ul v-if="badges">
        <li v-for="badge in getBadges" :key="badge._id">
          <!-- @todo maybe there will be some different styling depending in the type -->
          <span :class="badge.type">
            <img :src="badge.image.path" :alt="badge.image.alt" :title="badge.key">
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

  li:first-child {
    margin-left: -2px;
  }
  li img {
    height: 35px;
  }
  li {
    list-style: none;
    float: left;
    margin-right: -9px;


    &:nth-child(2),
    &:nth-child(4),
    &:nth-child(6) {
      img {
        margin-top: 19px;
        display: block;
      }
    }
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
