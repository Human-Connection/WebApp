### Filter List 

```js
new Vue({
  data () {
    return {
      categories: [
        {
          _id: 'gasdfdsaf789',
          title: 'Just For Fun', 
          icon: 'categories-justforfun'
        },
        {
          _id: 'aadsgagfdss9f',
          title: 'Glück & Werte', 
          icon: 'categories-luck'
        },
        {
          _id: 'asfsa78adst9f',
          title: 'Gesundheit & Wohlbefinden', 
          icon: 'categories-health'
        }
      ],
      selected: ['gasdfdsaf789', 'asfsa78adst9f']
    }
  },
  template: `<hc-filter-list :items="categories" :selected="selected" />`
})
```

### Single Filter Item(s)

```js
<div>
  <hc-filter-item :active="true" title="Just For Fun" icon="categories-justforfun" />
  <hc-filter-item :active="false" title="Glück & Werte" icon="categories-luck" />
  <hc-filter-item :disabled="true" title="Gesundheit & Wohlbefinden" icon="categories-health" />
  
  <hc-filter-item :active="true" title="Happy" iconSet="hc-emoji" icon="happy" />
</div>
```