<template>
  <section class="container page-auth-name">
    <div class="card" :class="classes">
      <div class="card-content">
        <div class="card-teaser">
          <img src="/assets/images/registration/nicetomeetyou.svg" alt="Human Connection"/>
        </div>
        <h1 class="title is-3 is-spaced">{{ $t('component.organization.createNew') }}</h1>
        <ul class="steps is-horizontal">
          <li class="steps-segment"
              :class="{
                'is-active': step === 1,
                'has-gaps': validatedStep < 1
              }">
            <a @click="toStep(1)" class="steps-marker">1</a>
          </li>
          <li class="steps-segment"
              :class="{
                'is-active': step === 2,
                'has-gaps': validatedStep < 2,
                'is-not-validated': validatedStep < 1
              }">
            <a @click="toStep(2)" class="steps-marker">2</a>
          </li>
          <li class="steps-segment disabled is-disabled"
              :class="{
                'is-active': step === 3,
                'has-gaps': validatedStep < 3,
                'is-not-validated': validatedStep < 2
              }">
            <a @click="toStep(3)" class="steps-marker">3</a>
          </li>
          <li class="steps-segment">
            <span class="steps-marker">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
            </span>
          </li>
        </ul>
        <form @submit.prevent="save">
          <transition :name="transitionName">
            <div key="step1" v-if="step === 1">
              <orga-form-step-1 ref="formStep" :data="form" @validate="onValidation" />
            </div>
            <div key="step2" v-if="step === 2">
              <article class="message is-small">
                <div class="message-body">
                  <i class="fa fa-warning"></i> {{ $t('component.organization.requiredHint') }}
                </div>
              </article>
              <orga-form-step-2 ref="formStep" :data="form" @validate="onValidation" />
            </div>
            <div key="step3" v-if="step === 3">
              <orga-form-step-3 ref="formStep" :data="form" @validate="onValidation" :hideButton="true" />
              <br />
              <hc-button color="primary"
                          @click.prevent="$refs.formStep.validate()"
                          size="medium"
                          type="button"
                          class="is-fullwidth"
                          :isLoading="isLoading"
                          :disabled="isLoading">
                <hc-icon class="icon-left" icon="check" /> {{ $t('button.create') }}
              </hc-button>
            </div>
          </transition>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import animatable from "~/components/mixins/animatable";
import { mapGetters } from "vuex";
import OrgaFormStep1 from "~/components/Organizations/steps/OrgaFormStep1.vue";
import OrgaFormStep2 from "~/components/Organizations/steps/OrgaFormStep2.vue";
import OrgaFormStep3 from "~/components/Organizations/steps/OrgaFormStep3.vue";

export default {
  layout: "blank",
  mixins: [animatable],
  components: {
    OrgaFormStep1,
    OrgaFormStep2,
    OrgaFormStep3
  },
  data() {
    return {
      form: {
        logo: null,
        name: '',
        type: '',
        isEnabled: false,
        description: '',
        url: '',
        categoryIds: [],
        tags: [],
        language: this.$i18n.locale()
      },
      step: 1,
      validatedStep: 0,
      transitionName: 'slide-next',
      errors: null,
      isLoading: false,
      uploadingLogo: false
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user"
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.toStep(1)
    });
  },
  methods: {
    onValidation (result) {
      if (!result) {
        this.animate('shake')
        this.$toast.open({
            message: this.$t('auth.validation.error'),
            type: 'is-danger'
          })
      } else if (this.  step === 3) {
        this.save()
      } else {
        this.form = Object.assign(this.form, result)
        this.toStep(this.step + 1)
      }
    },
    toStep(step) {
      this.transitionName = (step > this.step) ? 'slide-next' : 'slide-prev'

      // update next valid step
      if (step > this.step && step > this.validatedStep) {
        this.validatedStep = this.step
      }

      this.step = step;
    },
    async save() {

      this.errors = false;
      this.isLoading = true;
      this.$store
        .dispatch("organizations/create", this.form)
        .then(res => {
          this.isLoading = false;
          this.$router.push({ name: 'organizations-settings', query: { id: res._id } });
        })
        .catch(error => {
          this.$toast.open({
            message: error.message,
            duration: 3000,
            type: "is-danger"
          });
          this.errors = true;
          this.isLoading = false;
        });
    }
  },
  head() {
    return {
      title: this.$t("component.organization.createNew")
    };
  }
};
</script>

<style lang="scss">
  @import "assets/styles/_utilities";
  @import "assets/styles/_animations";
  @import "~bulma-steps-component/bulma-steps.sass";

  .page-auth-name {
    .card {
      margin: 0 auto;
      max-width: 460px;
      transition: all 100ms ease;
      transition-delay: 100ms;
      text-align: center;
      border: none;
      box-shadow: $card-shadow;

      .steps {
        padding: 0.5rem 1rem 0.5rem;

        .steps-segment::after {
          transition: all 250ms ease;
        }

        .is-active a,
        .is-not-validated a {
          pointer-events: none;
        }
      }

      .card-teaser {
        img {
          display: inline-block;
          max-width: 150px;
          height: auto;
        }
      }
    }

    form {
      margin: 1em auto;
      padding: 1em;
      text-align: left;
      min-height: 400px;
      transition: all 100ms ease;
      transition-delay: 100ms;
    }
  }
</style>
