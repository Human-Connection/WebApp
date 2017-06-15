<template>
    <div>
        <main-nav/>
        <div class="container" id="main">
            <nuxt/>
            <!--<my-footer/>-->
        </div>
    </div>
</template>

<script>
  import HcFooter from '~components/layout/Footer.vue'
  import MainNav from '~components/layout/MainNav.vue'

  export default {
    components: {
      HcFooter,
      MainNav
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
