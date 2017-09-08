### Writing CSS / SCSS inside components

When writing styles inside of components be sure to keep them local by initializing your tag like this:

```html
<style lang="scss" scoped>
```

### How to use global styles in local scope / components

You most probably need some global SCSS in your components local scope.

If you need any variables or Bulma files, first of all include `_utilities.scss`:

```scss
@import "assets/styles/utilities";
```

Now you have access to all variables and utilities, for example you can do:

```scss
@import "assets/styles/utilities";

.button {
  color: $primary;
  font-size: $size-medium;
}
```

If you want to use specific Bulma styles and extend them, include these styles as well.

Example:
```scss
@import "assets/styles/utilities";
@import "~bulma/sass/components/nav.sass";

nav {
    @extend .nav;
    @extend .has-shadow;
    position: fixed !important;
    width: 100%;
    top: 0;

    .nuxt-link-exact-active {
        @extend a.nav-item.is-active;
        font-weight: bold;
    }
}
```