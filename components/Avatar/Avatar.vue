<template>
    <div v-bind:style="{ backgroundImage: 'url(' + avatar + ')' }" class="img-circle profile-image"></div>
</template>


<script>
  export default {
    name: 'hc-avatar',
    props: {
      url: {
        type: String
      }
    },
    computed: {
      avatar () {
        return this.url ? this.url : '/assets/images/avatar-default/male/avatar200x200.jpg'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .profile-image {
    border:          1px solid #ccc;
    width:           36px;
    height:          36px;
    background:      #fff no-repeat center;
    background-size: cover;
  }

  .img-circle {
    border-radius: 50%;
  }

</style>
