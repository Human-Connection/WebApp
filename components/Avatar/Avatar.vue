<template>
    <div class="img-circle profile-image">
      <img v-if="thumbnails.raw" :src="avatar" :srcset="avatarSet" alt=""/>
    </div>
</template>


<script>
  import { isEmpty } from 'lodash'

  export default {
    name: 'hc-avatar',
    props: {
      url: {
        type: String
      },
      user: {
        type: Object
      }
    },
    data () {
      return {
        thumbnails: {
          small: null,
          medium: null,
          large: null,
          raw: null
        }
      }
    },
    computed: {
      avatar () {
        return this.thumbnails.raw
      },
      avatarSet () {
        return !isEmpty(this.thumbnails.large) ? `${this.thumbnails.small} small, ${this.thumbnails.medium} medium, ${this.thumbnails.large} large` : null
      }
    },
    watch: {
      user (data) {
        this.setData(data)
      }
    },
    mounted () {
      this.setData(this.user)
    },
    methods: {
      setData (data) {
        if (isEmpty(data) || isEmpty(data) || isEmpty(data.avatar)) {
          this.thumbnails.raw = '/assets/images/avatar-default/male/avatar200x200.jpg'
          this.thumbnails.small = null
          this.thumbnails.medium = null
          this.thumbnails.large = null
        } else if (!isEmpty(data.thumbnails)) {
          this.thumbnails.small = data.thumbnails.avatar.small
          this.thumbnails.medium = data.thumbnails.avatar.medium
          this.thumbnails.large = data.thumbnails.avatar.large
          this.thumbnails.raw = data.thumbnails.avatar.small
        } else if (!isEmpty(this.user.avatar)) {
          this.thumbnails.raw = this.user.avatar
          this.thumbnails.small = null
          this.thumbnails.medium = null
          this.thumbnails.large = null
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .profile-image {
    // border:          1px solid rgba(0, 0, 0, 0.1) !important;
    // box-shadow:      inset 0 0 1px -5px black !important;

    width:           36px;
    height:          36px;
    background:      #fff no-repeat center;
    background-size: cover;
    overflow:        hidden;

    img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover;
        overflow: hidden;
    }
  }

  .img-circle {
    border-radius: 50%;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    &:before {
      border-radius: 50%;
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }

</style>
