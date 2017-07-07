When developing a component please follow these basic rules:

**Stay DRY**

Check if there already is a component, that may fit your needs and just needs minor adjustments. If so, it might be the best to enhance this component instead of creating a new one.

**Keep it simple**

Be sure to just add the functionality that is needed at the moment.

**Keep it modular**

A component should only be responsible for a single functionality. If a component consists of more than 100 lines of code (without documentation) it might be best to split it into smaller junks.

**Use props as a components API**

Be sure to use flat props with expressive names. This ensures that one can quickly understand what values your component can receive and what it does.

Also use [JSDocs comments](http://usejsdoc.org/about-getting-started.html) to add useful information to your props on the fly.

Example:
```html
<script>
  export default {
    name: 'hc-button',
    props: {
      /**
       * Set color: primary, info, dark, white, danger, warning
       */
      color: {
        type: String,
        default: ''
      },
      /**
       * Set loading state: true | false
       */
      loading: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
```

**Add examples**

Do your fellow developers a favor by adding some example uses for your component in a *Readme.md*.

Example:
````html
A button can have different colors

```
<p>
  <hc-button>Default Button</hc-button>
  <hc-button color="primary">Primary Button</hc-button>
  <hc-button color="info">Info Button</hc-button>
</p>
```
````

If you would like to become a component superhero feel free to dive into the [Vuejs Component Style Guide](https://pablohpsilva.github.io/vuejs-component-style-guide/#/).