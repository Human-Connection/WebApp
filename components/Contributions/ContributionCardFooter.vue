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
      <hc-tooltip :label="$t('component.contribution.shoutsCountedDescription', {count: shoutCount}, shoutCount)" type="is-dark">
        <span class="meta-button">
          <i class="fa fa-bullhorn"></i>
          <small>{{ shoutCount }}</small>
        </span>
      </hc-tooltip>
      <hc-tooltip :label="$t('component.contribution.commentsCountedDescription', {count: commentCount}, commentCount)" type="is-dark">
        <span class="meta-button">
          <i class="fa fa-comments"></i>
          <small>{{ commentCount }}</small>
        </span>
      </hc-tooltip>
      <contribution-menu :post="post" />
    </div>
  </div>
</template>

<script>
  import ContributionMenu from '~/components/Contributions/ContributionMenu'
  import _ from 'lodash'

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
    computed: {
      commentCount () {
        return _.isEmpty(this.post.comments) ? 0
          : this.post.comments.length
      },
      shoutCount () {
        return _.isEmpty(this.post.shouts) ? 0
          : this.post.shouts.length
      },
      categories () {
        return _.isEmpty(this.post.categories) ? []
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

  .meta-button {
    display: flex;
    align-items: center;
    margin-right: 7px;

    .fa {
      margin-right:2px;
    }
  }
</style>
