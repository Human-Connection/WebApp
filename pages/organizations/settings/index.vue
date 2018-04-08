<template>
  <div>
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('component.organization.settingsWelcome') }}
      </h2>
      <p>Name</p>
    </div>
    <hr>
    <div class="columns">
      <div class="column">

      </div>
    </div>
    <footer class="card-footer">
      <hc-button
        :isLoading="isLoading"
        :disabled="isLoading"
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
    components: {
    },
    data() {
      return {
        form: {
          name: "",
        },
        isLoading: false
      };
    },
    mounted() {
    },
    methods: {
      async save() {
        this.isLoading = true;
      }
    },
    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    }
  };
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  .user-avatar {
    $borderRadius: 50%;

    border-radius: $borderRadius;
    width: 120px;
    height: 120px;
    position: relative;
    display: inline-block;
    background-color: #fff;
    overflow: hidden;

    .avatar-upload {
      & {
        border: none;
        border-radius: $borderRadius;
        overflow: hidden;
        width: 100%;
        height: 100%;
        max-height: 100%;
        min-height: 100%;
        max-width: 100%;
        min-width: 100%;
      }
    }

    .hc-upload.sending {
      i.fa {
        opacity: 0;
      }

      .hc-upload-progress {
        bottom: 49% !important;
        z-index: 10;
      }
    }

    &:before {
      border-radius: 50%;
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10;
      pointer-events: none;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }
</style>

