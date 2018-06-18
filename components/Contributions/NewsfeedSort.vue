<template>
  <div class="sort">
    <b-dropdown v-model="current"
                position="is-bottom-left"
                @change="changeSorting">
      <a class="button is-light" slot="trigger">
        &nbsp;
        <hc-icon :icon="sortOrderIcon" class="icon-left" />
        <span>{{ currentSortLabel }}</span>
        <hc-icon icon="angle-down" class="icon-right" />
      </a>
      <b-dropdown-item value="createdAt|desc">
        <!--<hc-icon icon="sort-desc" class="icon-left" /> &nbsp;-->
        <hc-icon icon="check" class="icon-left icon" /> &nbsp;
        {{ $t('component.contribution.sortCreatedAtDesc') }}
      </b-dropdown-item>
      <b-dropdown-item value="createdAt|asc">
        <!--<hc-icon icon="sort-asc" class="icon-left" /> &nbsp;-->
        <hc-icon icon="check" class="icon-left icon" /> &nbsp;
        {{ $t('component.contribution.sortCreatedAtAsc') }}
      </b-dropdown-item>
      <b-dropdown-item value="shoutCount|desc">
        <!--<hc-icon icon="sort-desc" class="icon-left" /> &nbsp;-->
        <hc-icon icon="check" class="icon-left icon" /> &nbsp;
        {{ $t('component.contribution.sortShoutCountDesc') }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
  import { upperFirst } from 'lodash'

  export default {
    data () {
      return {
        current: '',
        currentOrder: 'desc'
      }
    },
    mounted () {
      const sort = `${this.$store.getters['newsfeed/sortField']}|${this.$store.getters['newsfeed/sortOrder']}`
      this.changeSorting(sort, true)
    },
    computed: {
      sortOrderIcon () {
        const type = this.current.toLowerCase().indexOf('count') >= 0 ? 'numeric' : 'amount'
        return `sort-${type}-${this.currentOrder}`
      },
      currentSortLabel () {
        const order = this.current.split('|')
        return this.$t(`component.contribution.sort${upperFirst(order[0])}${upperFirst(order[1])}`)
      }
    },
    methods: {
      changeSorting (val, skip) {
        this.currentOrder = val.split('|')[1].toLowerCase()
        this.current = val

        // if (val === this.current || skip) {
        //   return
        // }

        const conf = val.split('|')
        this.$store.commit('newsfeed/setSortField', conf[0])
        this.$store.commit('newsfeed/setSortOrder', conf[1].toLowerCase())
        this.$store.commit('newsfeed/clear')
        this.$store.dispatch('newsfeed/fetch')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'assets/styles/utilities';

  .sort {
    padding-bottom: 1rem;
    text-align: right;

    .icon-left {
      margin-left: -0.6em;
    }

    .dropdown-item {
      .icon {
        opacity: 0;
      }

      &.is-active {
        background: transparent;
        color: $grey-dark;
        font-weight: bold !important;

        .icon {
          opacity: 1;
        }
      }
    }
  }
</style>
