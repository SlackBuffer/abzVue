# Overview

```js
var example = new Vue({
  data: {
    a: 1
  },
  computed: {
    b: function () {
      return this.a + 1
    }
  }
})

// both a & b are proxied on the created instance.
example.a // -> 1
example.b // -> 2
example.a++
```

- Vue.js itself is not a full-blown framework - it is focused on the **view layer** only
- Directives are prefixed with `v-` to indicate that they are special attributes provided by Vue.js
## Reactive data binding
- Vue.js embraces the concept of **data-driven view**
- In plain words, it means we use special syntax in our normal HTML templates to “bind” the DOM to the underlying data. Once the bindings are created, the DOM will then be kept in sync with the data. Whenever you modify the data, the DOM updates accordingly. As a result, most of our application logic is now directly manipulating data, rather than messing around with DOM updates
- Not only can we bind DOM text to the data, we can also bind the structure of the DOM to the data
- Vue.js also provides a powerful transition effect system that can automatically apply transition effects when elements are inserted/removed by Vue
## Component system
- Vue.js components don’t require any polyfills and works consistently in all supported browsers (IE9 and above). When needed, Vue.js components can also be wrapped inside a native custom element
- Vue.js components provide important features that are not available in plain custom elements, most notably cross-component data flow, custom event communication and dynamic component switching with transition effects
- https://v1.vuejs.org/api/