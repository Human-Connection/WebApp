<template>
  <div class="notification option">
    <author :user="notification.user"
      :created-at="notification.createdAt" />
    <p class="notification-message">
      {{ $t(`component.notification.message.${notification.type}`, messageParams) }}
    </p>
  </div>
</template>

<script>
  import author from '~/components/Author/Author.vue'

  export default {
    name: 'hc-notification-item',
    components: {
      'author': author
    },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    computed: {
      userName () {
        return this.notification.user.name
      },
      messageParams () {
        return {
          userName: this.userName,
          title: this.notification.contribution.title
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .option {
    border-bottom: 1px solid lighten($grey-lighter, 6%);
    transition: all .2s ease-out;
    padding: 8px 8px;
    margin-bottom: 0;
    cursor: pointer;
    background-color: $white;

    &:hover {
      // box-shadow: 0px 2px 7px rgba($black, 0.2);
      background-color: lighten($grey-lighter, 10%);
    }

    &:last-of-type {
      border-bottom: 0;
    }
  }

  .notification-message {
    // margin-top: 0.5em;
    padding: 1rem 0 0.5rem;
  }


  .notification {
    p {
      font-size: $size-7;
    }
  }
</style>