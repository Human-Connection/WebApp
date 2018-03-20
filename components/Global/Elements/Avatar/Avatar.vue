<template>
    <div class="img-circle profile-image">
      <hc-progressive-image v-if="user" :alt="user.name" :src="avatar" :preview="preview" :srcset="srcset" />
    </div>
</template>


<script>
  import thumbnailHelper from '~/helpers/thumbnails'

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
    computed: {
      avatar () {
        return thumbnailHelper.getThumbnail(this.user, 'avatar', 'small', '/assets/images/avatar-default/male/avatar200x200.jpg')
      },
      preview () {
        return thumbnailHelper.getThumbnail(this.user, 'avatar', 'placeholder')
      },
      srcset () {
        return thumbnailHelper.srcSetFromThumbnails(this.user, 'avatar', ['large', 'medium', 'small'])
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/utilities";

  .profile-image {
    box-shadow:      0 0 0 1px white;
    width:           36px;
    height:          36px;
    background:      #fff no-repeat center;
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
