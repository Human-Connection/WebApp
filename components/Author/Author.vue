<template>
    <div class="media hc__author" v-if="post" @click="showProfile">
        <div class="media-left">
            <hc-avatar :user="user"></hc-avatar>
        </div>
        <div class="media-content">
            <p class="title" v-if="!post.user">
                {{ $t('component.contribution.creatorUnknown') }}
            </p>
            <p class="title" v-else>
                {{ post.user.name }} </p>
            <p class="subtitle">
                <i class="fa fa-clock-o"></i>&nbsp;
                <hc-relative-date-time :dateTime="post.createdAt"></hc-relative-date-time>
            </p>
        </div>
    </div>
</template>

<script>
  import HcAvatar from '~/components/Avatar/Avatar.vue'
  import HcRelativeDateTime from '~/components/Global/Utilities/RelativeDateTime/RelativeDateTime.vue'

  export default {
    components: {
      HcAvatar,
      HcRelativeDateTime
    },
    name: 'hc-author',
    props: {
      post: {
        type: Object
      }
    },
    methods: {
      showProfile () {
        this.$router.push(`/profile/${this.user.slug}`)
      }
    },
    computed: {
      user () {
        return this.post.user || null
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "assets/styles/utilities";

    .hc__author {
        .profile-image {
            border: none;
            box-shadow:inset 0 0 0 1px rgba(0, 0, 0, .1);
        }

        small {
            display:        block;
            text-align:     center;
            text-transform: uppercase;
            padding:        5px 10px;
            margin:         0 auto;
        }

        .title {
            font-size:     $size-6;
            margin-bottom: 1.5rem;
        }

        .subtitle {
            padding-top: 3px;
            color:       $grey;
            font-size:   $size-7;

            .fa {
                font-size:  12px;
                margin-top: 2px;
                color:      $grey-light;
            }
        }

        .profile-image {
            width:               36px;
            height:              36px;
            background-position: center;
            background-size:     cover;
        }
    }

</style>
