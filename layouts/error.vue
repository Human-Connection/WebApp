<template>
  <div class="layout_blank" :id="id">
    <div class="content">
      <div id="error">
        <h1>
          <no-ssr>
            <TextGlitch :text="header" :steps=10 />
          </no-ssr>
        </h1>
        <h3 v-html="subHeader"></h3>
        <img :src="errorImage" :alt="header" class="error_img" />
        <p v-html="copy"></p>
      </div>
    </div>
    <footer>
      <a href="/">
        <img class="error_footer_logo" src="/Logo-Horizontal.svg" alt="Human Connection" style="max-width: 150px;" />
      </a>
    </footer>
  </div>
</template>
<script>
  import Raven from 'raven-js'
  import VueTextGlitch from 'vue-text-glitch'

  export default {
    props: ['error'],
    layout: 'blank',
    components: {
        'TextGlitch': VueTextGlitch
    },
    middleware: [
      'maintenance'
    ],
    head () {
      return {
        title: `Error ${this.statusCode}: ${this.header}`
      }
    },
    mounted () {
      if (this.$env.NODE_ENV === 'development') {
        console.error(this.error.message)
      }

      // show sentry error dialog if something happened
      if (Raven.lastEventId()) {
        Raven.showReportDialog()
      }
    },
    computed: {
      errorImage () {
        return `/assets/svg/errors/error${this.statusCode}.svg`
      },
      statusCode () {
        let code = 500
        const possibleErrors = [403, 404, 500, 503]
        if (possibleErrors.indexOf(this.error.statusCode) >= 0) {
          code = this.error.statusCode
        }
        return parseInt(code)
      },
      header () {
        return this.$t(`component.error.header${parseInt(this.statusCode)}`, 'Error')
      },
      subHeader () {
        return this.$t(`component.error.subHeader${parseInt(this.error.statusCode || 500)}`, this.error.message)
      },
      copy () {
        return this.$t(`component.error.copy${parseInt(this.statusCode)}`)
      },
      id () {
        return `page-name-${this.$route.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/_utilities";

  $backgroundColor: #F5F5F5;

  #error {
    margin-top: -50px;
    display: flex;
    flex-direction: column;
    // background-color: $backdrop-color;
    text-align: center;

    padding: 1.2rem;

    h1 {
      margin-bottom: 0;
      font-weight: bold;
      font-size: 2.5em;
    }
    h3 {
      margin-top: 0;
    }
    .error_img {
      min-height: 150px;
      max-height: 260px;
      padding: 3rem 2rem;
      object-fit: contain;
    }
  }

  footer {
    padding: 1rem;
    background-color: darken($backgroundColor, 5%);
    position: fixed;
    bottom: 0px;
    left: 0;
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  @media (max-height: 550px) {
    h1 {
      font-size: 1.5em;
    }
    #error {
      transform: scale(0.8);
    }
    #error .error_img {
      max-height: 25vh;
      padding: 1rem;
    }

    footer {
      padding: 0.2rem;
      height: 55px;

      .error_footer_logo {
        height: 25px;
      }
    }
  }

  // FIX UNTIL NUXT FIXES ITS LAYOUT ISSUES
  .layout_blank {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    overflow: scroll;
    background-color: $backgroundColor;
    margin: 0;

    & > .content {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 150ms;
      opacity: 1;
      margin: 0;
    }
  }

  .hidden {
    opacity: 0;
  }
</style>
