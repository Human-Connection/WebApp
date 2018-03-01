<template>
  <div class="hc-contribution-card-footer">
    <div class="tags-container">
      <div class="tags" v-if="categories.length">
        <hc-tooltip :label="$t(`component.category.slug2label-${category.slug}`)"
                   v-for="category in categories"
                   :key="category._id"
                   style="margin-right: 5px;"
                   type="is-dark">
            <span class="tag" style="border-radius: 100%; width: 32px; height: 32px; font-size: 1rem; opacity: 0.8;">
              <hc-icon v-if="category.icon" set="hc" :icon="category.icon"></hc-icon>
            </span>
        </hc-tooltip>
      </div>
    </div>
    <div class="meta-container">
      <hc-tooltip :label="$t('component.shout.countedDescription', {count: post.shoutCount || 0}, post.shoutCount || 0)" type="is-dark">
        <span class="meta-button">
          <i class="fa fa-bullhorn"></i>
          <small>{{ post.shoutCount }}</small>
        </span>
      </hc-tooltip>
      <hc-tooltip :label="$t('component.contribution.commentsCountedDescription', {count: commentCount}, commentCount)" type="is-dark">
        <span class="meta-button">
          <i class="fa fa-comments"></i>
          <small>{{ commentCount }}</small>
        </span>
      </hc-tooltip>
      <contribution-menu :post="post" @update="onContribSettingsUpdate" />
    </div>
  </div>
</template>

<script>
  import ContributionMenu from '~/components/Contributions/ContributionMenu'
  import { isEmpty } from 'lodash'

  export default {
    name: 'hc-contribution-card-footer',
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    components: {
      ContributionMenu
    },
    methods: {
      onContribSettingsUpdate (data) {
        this.$store.commit('newsfeed/updateContribution', data)
      }
    },
    computed: {
      commentCount () {
        return isEmpty(this.post.comments) ? 0
          : this.post.comments.length
      },
      categories () {
        return isEmpty(this.post.categories) ? []
          : this.post.categories
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  .hc-contribution-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $grey;
  }

  .meta-container {
    display: flex;
    align-items: center;
  }

  .tags-container {
    z-index: 3;
  }
  .meta-container {
    z-index: 4;
  }

  .meta-button {
    display: flex;
    align-items: center;
    margin-right: 7px;

    .fa {
      margin-right:2px;
    }
  }
</style>
