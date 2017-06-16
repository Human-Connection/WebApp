<template>
    <section class="container">
        <br/><br/><br/>
        <div class="columns is-vcentered">
            <div class=" column is-6 is-offset-3 has-text-centered">
                    <img src="/assets/svg/hc-smilies-03.svg" width="150px">
                    <h1 class="title is-1">
                        <strong>{{ error.statusCode }}</strong>
                    </h1>
                    <p class="info">
                        {{ error.message }}
                    </p>
            </div>
        </div>
        <br/>
    </section>
</template>
<script>
  export default {
    props: ['error']
  }
</script>

<style scoped>
    .title {
        margin-top: 15px;
        font-size:  5em;
        margin-bottom: 5px;
    }

    .info {
        font-weight: 300;
        color:       #5b6569;
        margin:      0;
    }

    .button {
        margin-top: 50px;
    }
</style>
