A button can have different colors

```
<p>
  <hc-button color="primary">Primary Button</hc-button>
  <hc-button color="info">Info Button</hc-button>
  <hc-button color="dark">Dark Button</hc-button>
  <hc-button color="white">White Button</hc-button>
  <hc-button color="danger">Danger Button</hc-button>
  <hc-button color="warning">Warning Button</hc-button>
</p>
```

A button can render with different types: button (default), nuxt, link

```
<p>
  <hc-button type="nuxt" color="primary" to="/">Nuxt Link</hc-button>
  <hc-button type="link" color="primary">Normal Link</hc-button>
</p>
```

A button can appear in loading state

```
<hc-button color="primary" :loading="true">Loading Button</hc-button>
```