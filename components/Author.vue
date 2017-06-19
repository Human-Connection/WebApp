<template>
    <div class="media hc__author" v-if="post">
        <div class="media-left">
            <figure class="image">
                <div v-bind:style="{ backgroundImage: 'url(' + avatar.small + ')' }" class="img-circle profile-image"></div>
            </figure>
        </div>
        <div class="media-content">
            <p class="title" v-if="!post.user">
                Anonymus
            </p>
            <p class="title" v-else-if="post.user.username">
                {{ post.user.username }}
            </p>
            <p class="title" v-else>
                {{ post.user.email }}
            </p>
            <p class="subtitle">
                <i class="fa fa-clock-o"></i>&nbsp;
                <relative-date-time :dateTime="post.createdAt"></relative-date-time>
            </p>
        </div>
    </div>
</template>


<script>
  import relativeDateTime from './RelativeDateTime.vue'
  import truncate from './Truncate.vue'

  export default {
    props: ['post'],
    components: {
      'relative-date-time': relativeDateTime,
      'truncate': truncate
    },
    computed: {
      avatar () {
        const defaultAvatar = {
          small: '/assets/images/avatar-default/male/avatar100x100.jpg',
          medium: '/assets/images/avatar-default/male/avatar200x200.jpg',
          large: '/assets/images/avatar-default/male/avatar200x200.jpg'
        }
        return (this.post.user && this.post.user.avatar) ? this.post.user.avatar : defaultAvatar
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "../assets/styles/utilities";

    .hc__author {
        .profile-image {
            border: 1px solid #ccc
        }

        small {
            display:        block;
            text-align:     center;
            text-transform: uppercase;
            padding:        5px 10px;
            margin:         0 auto;
        }

        .title {
            font-size: $size-6;
            margin-bottom: 1.5rem;
        }

        .subtitle {
            padding-top:3px;
            color: $grey;
            font-size: $size-7;

            .fa {
                font-size: 12px;
                margin-top:2px;
                color: $grey-light;
            }
        }

        .profile-image {
            width:               36px;
            height:              36px;
            background-position: center;
            background-size:     cover;
        }

        .img-circle {
            border-radius: 50%;
        }
    }

</style>
