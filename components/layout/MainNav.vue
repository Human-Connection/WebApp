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
                <nuxt-link class="nav-item is-tab" :to="{ name: 'index' }">
                    Dashboard
                </nuxt-link>
                <nuxt-link v-if="!this.$store.getters.user" :to="{ name: 'login' }" class="nav-item is-tab">
                    Login
                </nuxt-link>
                <nuxt-link v-else :to="{ name: 'profile' }" class="nav-item is-tab">
                    Hallo {{$store.getters.user.username}}!
                </nuxt-link>
                <!--<nuxt-link v-else class="nav-item">-->
                <!--Logout-->
                <!--</nuxt-link>-->
            </div>
        </div>
    </nav>
</template>


<script>

</script>

<style lang="scss">
    @import "~bulma";

    nav {
        .nuxt-link-exact-active {
            @extend a.nav-item.is-active;
            font-weight: bold;
        }
    }
</style>
