<template>
  <span class="ql-embed-source-icon">
    <img :src="meta.icon.any"
        @error="hasError = true"
        v-if="meta.icon && meta.icon.any && !hasError" />
    <span v-else>
      <svg viewBox="0 0 8 12" version="1.1">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <polygon id="Shape" fill="currentcolor" points="0 10.59 4.58 6 0 1.41 1.41 0 7.41 6 1.41 12"></polygon>
        </g>
      </svg>
    </span>
  </span>
</template>

<script>
  export default {
    name: 'ql-embed-source-icon',
    props: {
      meta: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        hasError: false
      }
    }
  }
</script>

<style lang="scss">
  .ql-embed-source-icon {
    margin-right: 3px;
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 1;

    img {
      height: 100%;
      width: 100%;
    }

    span {
      height: 100%;
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: #999;
      border-radius: 50%;
      color: #fff;

      svg {
        width: 5px;
        height: auto;
      }
    }
  }
</style>
