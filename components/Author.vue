<template>
    <div class="media" v-if="post">
        <div class="media-left">
            <figure class="image">
                <div v-bind:style="{ backgroundImage: 'url(' + post.user.avatar.small + ')' }" class="img-circle profile-image"></div>
            </figure>
        </div>
        <div class="media-content">
            <p class="title is-5">{{ post.user.username }}</p>
            <p class="subtitle is-6">
                <i class="fa fa-clock-o" style="font-size: 15px; margin-top: 2px"></i>&nbsp;
                <relative-date-time :dateTime="post.created_at"></relative-date-time>
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

<style>

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
