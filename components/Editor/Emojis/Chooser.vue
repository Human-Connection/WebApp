<template>
  <div class="hc-emoji-chooser">
    <div class="hc-emoji-list">
      <div v-for="(emoji, name) in emojis"
        :key="name" @click="choose(emoji, name)"
        class="hc-emoji-item">{{ emoji }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-emoji-chooser',
    data () {
      return {
        emojis: {
          'blush': '😊',
          'grinning': '😀',
          'joy': '😂',
          'smiley': '😃',
          'smile': '😄',
          'sweat_smile': '😅',
          'laughing': '😆',
          'innocent': '😇',
          'wave': '👋',
          'ok_hand': '👌',
          'thumbsup': '👍',
          'thumbsdown': '👎',
          'clap': '👏',
          'heart': '❤️️',
          'wink': '😉',
          'yum': '😋',
          'relieved': '😌',
          'heart_eyes': '😍',
          'sunglasses': '😎',
          'smirk': '😏',
          'neutral_face': '😐',
          'expressionless': '😑',
          'unamused': '😒',
          'sweat': '😓',
          'pensive': '😔',
          'confused': '😕',
          'confounded': '😖',
          'kissing': '😗',
          'kissing_heart': '😘',
          'kissing_smiling_eyes': '😙',
          'kissing_closed_eyes': '😚',
          'stuck_out_tongue': '😛',
          'stuck_out_tongue_winking_eye': '😜',
          'stuck_out_tongue_closed_eyes': '😝',
          'disappointed': '😞',
          'worried': '😟',
          'angry': '😠',
          'rage': '😡',
          'cry': '😢',
          'persevere': '😣',
          'triumph': '😤',
          'disappointed_relieved': '😥',
          'frowning': '😦',
          'anguished': '😧',
          'fearful': '😨',
          'weary': '😩',
          'tired_face': '😫',
          'grimacing': '😬',
          'sob': '😭',
          'scream': '😱',
          'flushed': '😳',
          'sleeping': '😴',
          'dizzy_face': '😵',
          'upside_down_face': '🙃',
          'face_with_rolling_eyes': '🙄',
          'smiling_imp': '😈'
        }
      }
    },
    methods: {
      choose (emoji, name) {
        this.$emit('choose', {
          string: emoji,
          name
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .hc-emoji-chooser {
    position: relative;
  }

  .hc-emoji-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px;
  }

  .hc-emoji-item {
    position: relative;
    height: 36px;
    flex: 0 0 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    cursor:pointer;
    font-size: 16px;

    &:hover {
      background-color: $white-ter;
    }
  }
</style>
