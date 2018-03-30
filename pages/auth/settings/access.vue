<template>
  <div class="security fullwidth-box">
    <div class="info-text">
      <h2 class="title is-3">
        {{ $t('auth.settings.securityWelcome') }}
      </h2>
      <p>{{ $t('auth.settings.securityWelcomeText') }}</p>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('auth.settings.currentPassword') }}</label>
          <p class="control">
            <input v-model="form.currentPassword" type="password" class="input">
          </p>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <label class="label">{{ $t('auth.settings.newPassword') }}</label>
          <p class="control">
            <input v-model="form.newPassword" type="password" class="input">
          </p>
        </div>
        <div class="field">
          <label class="label">{{ $t('auth.settings.newPasswordConfirm') }}</label>
          <p class="control">
            <input v-model="form.newPasswordConfirm" type="password" class="input">
          </p>
        </div>
      </div>
    </div>
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
  export default {
    transition: 'NONE',
    data () {
      return {
        form: {},
        isLoading: false
      }
    },
    methods: {
      save () {

      }
    }
  }
</script>
