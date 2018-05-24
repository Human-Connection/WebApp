<template>
  <div class="hc-follower-item"
       :class="{ 'is-active': user.slug }"
       @click="showProfile">
    <hc-avatar class="hc-follower-image"
               :showOnlineStatus="true"
               :user="user" />
    <div class="hc-follower-details">
      <span class="details-title">{{ user.name }}</span>
      <span v-if="lastContributionDate"
            class="details-timestamp">
          {{ $t('auth.account.myFollowerItemLastContribution') }} <hc-relative-date-time :dateTime="lastContributionDate"></hc-relative-date-time>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-follower-item',
    props: ['user'],
    data () {
      return {
        lastContributionDate: null
      }
    },
    mounted () {
      this.$api.service('contributions').find({
        query: {
          $limit: 1,
          $select: ['createdAt'],
          $sort: {
            createdAt: -1
          },
          isEnabled: 1,
          userId: this.user._id
        }
      }).then((res) => {
        if (res.total && res.data) {
          this.lastContributionDate = res.data[0].createdAt
        }
      })
    },
    computed: {
      timestamp () {
        return this.lastContributionDate
      }
    },
    methods: {
      showProfile () {
        if (this.user.slug) {
          this.$router.push(`/profile/${this.user.slug}`)
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'assets/styles/utilities';

  .hc-follower-item {
    display: flex;
    padding-bottom: 8px;

    &.is-active {
      cursor: pointer;
    }

    .hc-follower-image {
      // padding-right: 5px;
      width:         42px;
      height:        42px;
    }
    .hc-follower-details {
      display: flex;
      flex-direction: column;
      padding-left: 15px;
      .details-title {
        font-size: 12px;
        font-weight: bold;
      }
      .details-timestamp {
        font-size: 10px;
        margin-top: -0.8em;
        color: $grey;
      }
    }
  }
</style>
