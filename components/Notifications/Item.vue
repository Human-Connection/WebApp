<template>
  <div class="notification option">
    <template v-if="notification.user">
      <author class="author"
              :user="notification.user"
              :created-at="notification.createdAt" />
    </template>
    <template v-else>
      <!-- this is needed for old messages to not break the interface, should be removed later -->
      <author class="author"
              :user="notification.comment.user || notification.contribution.user"
              :created-at="notification.comment.createdAt || notification.contribution.createdAt" />
    </template>
    <p class="notification-message" v-html="message"></p>
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
        return this.notification.user ? this.notification.user.name : (this.notification.comment.user.name || this.notification.contribution.user.name)
      },
      message () {
        return this.$t(`component.notification.message.${this.notification.type || 'comment'}`, this.messageParams)
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

  .author {
    pointer-events: none;
  }

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