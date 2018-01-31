<template>
  <div class="cando-action" v-if="isVerified">
    <div v-if="isDone" :key="1">
      <hc-tooltip type="is-dark"
        :label="$t('component.contribution.canDoResetInfo')">
        <hc-button @click="toggleDone" :size="size">
          <hc-icon icon="smile-o" />
          {{ $t('component.contribution.canDoCompleted') }}
        </hc-button>
      </hc-tooltip>
    </div>
    <div v-else-if="onList" :key="2">
      <hc-button @click="toggleDone" color="info" :size="size">
        <hc-icon icon="check" />
        {{ $t('component.contribution.canDoSetDone') }}
      </hc-button>
      <hc-tooltip type="is-dark"
        :label="$t('component.contribution.canDoCancelInfo')">
        <hc-button @click="removeFromList" color="default" :size="size">
          <hc-icon icon="ban" />
        </hc-button>
      </hc-tooltip>
    </div>
    <div v-else :key="3">
      <hc-button @click="addToList" :size="size">
        <hc-icon icon="plus" />
        {{ $t('component.contribution.canDoAdd') }}
      </hc-button>
    </div>
  </div>
</template>

<script>
  import feathers from '~/plugins/feathers'
  import {mapGetters} from 'vuex'

  export default {
    name: 'hc-cando-action',
    props: {
      post: {
        type: Object,
        required: true
      },
      size: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters({
        isVerified: 'auth/isVerified',
        user: 'auth/user'
      }),
      canDo () {
        return this.post.cando
      },
      candoUsers () {
        return this.post.candoUsers
      },
      canDoCount () {
        return this.candoUsers ? this.candoUsers.length : 0
      },
      canDoDoneUsers () {
        return this.candoUsers.filter(({done}) => !!done).length
      },
      canDoDoneCount () {
        return this.canDoDoneUsers ? this.canDoDoneUsers.length : 0
      },
      currentUserCando () {
        if (!this.user || !this.candoUsers) {
          return null
        }
        return this.post.candoUsers.find(({userId}) => {
          return userId === this.user._id
        })
      },
      onList () {
        return !!this.currentUserCando
      },
      isDone () {
        return this.currentUserCando && this.currentUserCando.done
      },
      doneAt () {
        return this.currentUserCando && this.currentUserCando.doneAt
      }
    },
    methods: {
      addToList () {
        if (!this.isVerified || !this.user || !this.canDo) {
          return false
        }
        let data = {
          userId: !this.user._id,
          contributionId: this.post._id
        }
        feathers.service('users-candos')
          .create(data)
          .then(data => {
            this.updateContribution(this.$t('component.contribution.canDoAddedSuccess'))
          })
          .catch(this.handleError)
      },
      removeFromList () {
        if (!this.currentUserCando) {
          return false
        }
        feathers.service('users-candos')
          .remove(this.currentUserCando._id)
          .then(data => {
            this.updateContribution(this.$t('component.contribution.canDoCanceledSuccess'))
          })
          .catch(this.handleError)
      },
      toggleDone () {
        if (!this.currentUserCando) {
          return false
        }
        let data = {
          done: !this.currentUserCando.done
        }
        feathers.service('users-candos')
          .patch(this.currentUserCando._id, data)
          .then(data => {
            let message = data.done
              ? this.$t('component.contribution.canDoDoneSuccess')
              : this.$t('component.contribution.canDoUndoneSuccess')
            this.updateContribution(message)
          })
          .catch(this.handleError)
      },
      updateContribution (message) {
        feathers.service('contributions')
          .get(this.post._id)
          .then(data => {
            this.$emit('update', data)
            this.$store.commit('newsfeed/updateContribution', data)
            this.$snackbar.open({
              message,
              duration: 4000,
              type: 'is-success'
            })
          })
      },
      handleError (error) {
        console.error(error)
        this.isLoading = false
        this.$toast.open({
          message: error.message,
          duration: 3000,
          type: 'is-danger'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'assets/styles/utilities';

  i.fa {
    position: relative;
    top: 1px;
    margin-right: 5px;
  }
</style>
