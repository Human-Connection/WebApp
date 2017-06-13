<template>
    <div class="container">
        <nav class="nav">
            <div class="nav-left">
                <nuxt-link class="nav-item" :to="{ name: 'index' }" style="display: inline-block; position: relative; max-height: none; min-width: 150px">
                    <img src="/logo-hc.svg" alt="Human Connection" style="max-height: none; height: 100%;">
                </nuxt-link>
                <a href="" class="nav-item">
                    <i class="fa fa-comments" aria-hidden="true"></i>
                </a>
                <a href="" class="nav-item">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </a>
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
                <nuxt-link class="nav-item" :to="{ name: 'index'}">
                    Dashboard
                </nuxt-link>
                <nuxt-link v-if="!this.$store.getters.user" :to="{ name: 'login' }" class="nav-item">
                    Login
                </nuxt-link>
                <nuxt-link v-else :to="{ name: 'profile' }" class="nav-item">
                    Hallo {{$store.getters.user.username}}!
                </nuxt-link>
                <!--<nuxt-link v-else class="nav-item">-->
                    <!--Logout-->
                <!--</nuxt-link>-->
            </div>
        </nav>
        <nuxt/>
        <!--<my-footer/>-->
    </div>
</template>

<script>
  import MyFooter from '~components/Footer.vue'

  export default {
    components: {
      MyFooter
    }
  }
</script>

<style>
    /*.container {*/
    /*margin:     0;*/
    /*width:      100%;*/
    /*padding:    100px 0;*/
    /*text-align: center;*/
    /*}*/

    /*.button, .button:visited {*/
    /*display:          inline-block;*/
    /*color:            black;*/
    /*letter-spacing:   1px;*/
    /*background-color: #fff;*/
    /*border:           2px solid #000;*/
    /*text-decoration:  none;*/
    /*text-transform:   uppercase;*/
    /*padding:          15px 45px;*/
    /*}*/

    /*.button:hover, .button:focus {*/
    /*color:            #fff;*/
    /*background-color: #000;*/
    /*}*/

    /*.title {*/
    /*color:       #000;*/
    /*font-weight: 300;*/
    /*font-size:   2.5em;*/
    /*margin:      0;*/
    /*}*/
</style>
