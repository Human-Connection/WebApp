<template>
    <div class="media" v-if="post">
        <div class="media-left">
            <figure class="image">
                <div v-if="post.user.avatar" v-bind:style="{ backgroundImage: 'url(' + post.user.avatar.small + ')' }" class="img-circle profile-image"></div>
                 <div v-else v-bind:style="{ backgroundImage: 'url(/assets/images/avatar-default/male/avatar200x200.jpg)' }" class="img-circle profile-image"></div>
            </figure>
        </div>
        <div class="media-content">
            <p class="title is-5" v-if="post.user.username">
                {{ post.user.username }}
            </p>
            <p class="title is-5" v-else>
                {{ post.user.email }}
            </p>
            <p class="subtitle is-6">
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
    }
  }
</script>

<style scoped lang="scss">
    @import "../assets/styles/utilities";

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
</style>
