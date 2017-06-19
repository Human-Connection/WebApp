<template>
    <nav class="nav has-shadow">
        <div class="container">
            <div class="nav-left">
                <nuxt-link class="nav-item" :to="{ name: 'index' }" style="display: inline-block; position: relative; max-height: none; min-width: 150px">
                    <img src="/logo-hc.svg" alt="Human Connection" style="max-height: none; height: 100%;">
                </nuxt-link>
                <a href="" class="nav-item">
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <span class="nav-item">
                    <notifications></notifications>
                </span>
            </div>

            <!-- This "nav-toggle" hamburger menu is only visible on mobile -->
            <!-- You need JavaScript to toggle the "is-active" class on "nav-menu" -->
            <span class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
                </span>

            <!-- This "nav-menu" is hidden on mobile -->
            <!-- Add the modifier "is-active" to display it on mobile -->
            <div class="nav-right nav-menu">
                <nuxt-link class="nav-item is-tab" :to="{ name: 'index' }">
                    Dashboard
                </nuxt-link>
                <nuxt-link v-if="!isAuthenticated" :to="{ name: 'login' }" class="nav-item is-tab">
                    Login
                </nuxt-link>
                <template v-else>
                    <nuxt-link :to="{ name: 'profile' }" class="nav-item is-tab">
                        Hallo&nbsp;
                        <span v-if="user.username"> {{user.username}}</span>
                        <span v-else> {{user.email}}</span>!
                    </nuxt-link>
                    <a class="nav-item is-tab" @click.prevent="logout()">
                        <i class="fa fa-sign-out" aria-hidden="true"></i>
                    </a>
                </template>
                <!--<nuxt-link v-else class="nav-item">-->
                <!--Logout-->
                <!--</nuxt-link>-->
            </div>
        </div>
    </nav>
</template>


<script>
  import {mapGetters} from 'vuex'
  import Notifications from '../Notifications/Notifications.vue'
  export default {
    components: {
      'notifications': Notifications
    },
    data () {
      return {
        credentials: {
          username: '',
          password: ''
        },
        loading: false,
        stayLoggedIn: false,
        errors: null
      }
    },
    computed: {
      ...mapGetters({
        isAuthenticated: 'auth/isAuthenticated',
        user: 'auth/user'
      })
    },
    methods: {
      logout () {
        this.$store.dispatch('auth/logout')
          .then(() => {
            this.$router.replace('/')
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  }
</script>

<style lang="scss">
    @import "../../assets/styles/_bulma";

    nav {
        .nuxt-link-exact-active {
            @extend a.nav-item.is-active;
            font-weight: bold;
        }
    }

    .nav-left {
        overflow: visible;
    }
</style>
