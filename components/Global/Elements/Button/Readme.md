### Colors

A button can have different colors

```
<div>
  <p>
    <hc-button>Default Button</hc-button>
    <hc-button color="dark">Dark Button</hc-button>
    <hc-button color="light">Light Button</hc-button>
  </p>
  <p>
    <hc-button color="success">Success Button</hc-button>
    <hc-button color="info">Info Button</hc-button>
    <hc-button color="danger">Danger Button</hc-button>
    <hc-button color="warning">Warning Button</hc-button>
  </p>
</div>
```

### Circle

A button can be circular

```
<div>
  <hc-button size="xsmall" circle>
    <hc-icon icon="plus" />
  </hc-button>
  <hc-button size="small" circle>
    <hc-icon icon="plus" />
  </hc-button>
  <hc-button circle>
    <hc-icon icon="plus" />
  </hc-button>
  <hc-button size="medium" circle>
    <hc-icon icon="plus" />
  </hc-button>
  <hc-button size="large" circle>
    <hc-icon icon="plus" />
  </hc-button>
</div>
```

### Loading

A button can appear in loading state

```
<hc-button :isLoading="true">Loading Button</hc-button>
```

### Types

A button can render with different types: button (default), nuxt, link

```
<p>
  <hc-button type="nuxt" to="/">Nuxt Link</hc-button>
  <hc-button type="link">Normal Link</hc-button>
</p>
```