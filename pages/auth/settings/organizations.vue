<template>
  <div>
    <h2 class="title is-3">
      {{ $t('auth.settings.myOrganizations', 'My Organizations') }}
    </h2>
    <footer class="card-footer">
      <hc-button :isLoading="isLoading"
                  :disabled="true"
                  @click.prevent="save">
        <i class="fa fa-check"></i>
        &nbsp;<span>{{ $t('auth.settings.saveLabel', 'Save') }}</span>
      </hc-button>
    </footer>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { isEmpty } from "lodash";

  export default {
    transition: 'NONE',
    data() {
      return {
        form: {
        },
        usersettings: {},
        isLoading: false
      };
    },
    async mounted () {
      const usersettings = await this.$api.service('usersettings').find({
        query: {
          userId: this.user._id
        }
      })
      console.log(usersettings)
      this.usersettings = usersettings.data[0]
    },
    methods: {
      async save() {

      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    }
  };
</script>
