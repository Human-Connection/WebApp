<template>
    <section class="container">
        <br/><br/><br/>
        <div class="columns is-vcentered">
            <div class="card column is-6 is-offset-3 has-text-centered">
                <section class="section">
                    <h1 class="title">
                        {{ error.statusCode }}
                    </h1>
                    <h2 class="info">
                        {{ error.message }}
                    </h2>
                    <nuxt-link class="button" to="/" v-if="error.statusCode === 404">
                        Go Back
                    </nuxt-link>
                </section>
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
    }

    .info {
        font-weight: 300;
        color:       #9aabb1;
        margin:      0;
    }

    .button {
        margin-top: 50px;
    }
</style>
