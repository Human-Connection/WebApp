<template>
  <component :is="type" class="index">
    <nav-bar active="Index" :navItems="[
      {name: 'Template', component: 'Index', href: '/#/'},
      {name: 'Living Docs', href: 'http://localhost:6060/'}
    ]"/>
    <wrapper>
      <heading level="h1">Humanis</heading>
      <text-style><a href="/#/">Humanis</a> is Human Connection's Design System. It provides our team a set of organized tools, patterns &amp; practices. It works as the foundation for our application development.</text-style>
      <hc-button href="http://localhost:6060/" type="a">Open Living Docs</hc-button>
    </wrapper>
  </component>
</template>

<script>
/**
 * Shows how to layout and structure a home page.
 */
export default {
  name: "Index",
  status: "deprecated",
  release: "1.0.0",
  metaInfo: {
    title: "Vue Design System",
    htmlAttrs: {
      lang: "en",
    },
  },
  props: {
    /**
     * The html element name used for the component.
     */
    type: {
      type: String,
      default: "div",
    },
  },
}
</script>

<style lang="scss" scoped>
// Design Tokens with local scope
$color-template-background: $color-white-bis;
$color-template-background-top: tint($color-template-background, 5%);
$color-template-background-bottom: shade($color-template-background, 5%);
$color-template-text: $color-black-bis;
$color-template-link: $color-green;

.index {
  @include reset;
  @include inset-space($space-base);
  min-height: $space-xx-large * 4;
  background: $color-template-background;
  background: linear-gradient(0deg, $color-template-background-bottom, $color-template-background-top 100%);
  text-align: center;
  position: relative;
  float: left;
  height: 100%;
  width: 100%;
  @media #{$media-query-large} {
    // This is how you’d use design tokens with media queries
  }
  .heading {
    color: $color-template-text;
  }
  .text-style {
    color: $color-template-text;
  }
  .text-link {
    color: $color-template-link;
  }
  .wrapper {
    max-width: $space-xx-large * 4.5;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    left: 50%;
    top: 50%;
  }
}
</style>

<docs>
  ```jsx
  <index />
  ```
</docs>
