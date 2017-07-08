<template>
    <footer class="footer">
        <div class="container">
            <div class="content has-text-centered">
                <p>
                    made with <span style="color: #f00">♥</span> by <a href="http://human-connection.org" target="_blank">human-connection.org</a>
                </p>
                <p>
                    <nuxt-link :to="{ name: 'legal' }">Impressum</nuxt-link>
                </p>
            </div>
        </div>
    </footer>
</template>

<script>
  export default {
    name: 'hc-footer'
  }
</script>
