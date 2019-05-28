- https://v1.vuejs.org/api/
# Options / Data
## `data`
- The data object for the Vue instance
    - Vue.js will recursively convert its properties into getter/setters to make it “reactive”
    - The object must be **plain**: [ ] native objects, existing getter/setters and prototype properties are ignored
    - It is not recommended to observe complex objects
- Once the instance is created, the original data object can be accessed as `vm.$data`
- The Vue instance also proxies all the properties found on the data object
    - Properties that start with `_` or `$` will not be proxied on the Vue instance because they may conflict with Vue’s internal properties and API methods. You will have to access them as `vm.$data._property`
- **Only accepts Function when used in a component definition**
- If required, a deep clone of the original object can be obtained by passing `vm.$data` through `JSON.parse(JSON.stringify())`
## `props`
- A list/hash of attributes that are exposed to accept data from the parent component
    - It has a simple Array-based syntax and an alternative Object-based syntax that allows advanced configurations such as type checking, custom validation and **default values**
- > https://v1.vuejs.org/guide/components.html#Prop-Validation
## `computed`
- Computed properties to be mixed into the Vue instance
- All getters and setters have their `this` context automatically bound to the Vue instance
## `methods`
- Methods to be mixed into the Vue instance
    - Access these methods directly on the VM instance (`vm.methodName`), or use them in directive expressions (`methodName`)
- All methods will have their `this` context automatically bound to the Vue instance
## `$watch`
- An object where keys are expressions to watch and values are the corresponding callbacks
    - The value can also be a string of a method name, or an Object that contains additional options
- The Vue instance will call `$watch()` for each entry in the object at instantiation

```js
var vm = new Vue({
  data: {
    a: 1
  },
  watch: {
    'a': function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
    },
    // string method name
    'b': 'someMethod',
    // deep watcher
    'c': {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    }
  }
})
vm.a = 2 // -> new: 2, old: 1
```

# Options / DOM
## `$el`
- Provide the Vue instance an existing DOM element to mount on
    - It can be a CSS selector string, an actual HTMLElement, or a function that returns an HTMLElement
- Note that the provided element merely serves as a mounting point; it will be replaced if a template is also provided, unless `replace` is set to `false`
- The resolved element will be accessible as `vm.$el`
- Only accepts type Function when used in a component definition
    - When used in `Vue.extend`, a function must be provided so each instance gets a separately created element
- If this option is available at instantiation, the instance will immediately enter compilation; otherwise, the user will have to explicitly call `vm.$mount()` to manually start the compilation
- Only accepts type Function when used in a component definition
## `template`
- A string template to be used as the markup for the Vue instance
    - By default, the template will replace the mounted element
    - When the `replace` option is set to `false`, the template will be inserted into the mounted element instead
    - In both cases, any existing markup inside the mounted element will be **ignored**, unless content distribution **slots** are present in the template
- If the string starts with `#` it will be used as a querySelector and use the selected element’s innerHTML as the template string
    - This allows the use of the common `<script type="x-template"> trick to include templates`
- Under certain situations, for example when the template contains more than one top-level element, or contains only plain text, the instance will become a fragment instance - i.e. one that manages a list of nodes rather than a single node. Non flow-control directives on the mount point for fragment instances are ignored
## `replace`
- Only respected if the `template` option is also present
- Determines whether to replace the element being mounted on with the template
    - If set to `false`, the template will overwrite the element’s inner content without replacing the element itself
    - If set to `true` (default), the template will **overwrite the element** and **merge the element’s attributes** with the attributes of the **component’s root node**
    - > https://codepen.io/slackbuffer/pen/EzEayz?editors=1011
# Options / Lifecycle Hooks
## `init`
- Called synchronously after the instance has just been initialized, **before** data observation and event / watcher setup
## `created`
- Called synchronously after the instance is created
- At this stage, the instance has **finished processing the options** which means the following have been set up: data observation, computed properties, methods, watch/event callbacks
- **DOM compilation has not been started**, and the `$el` property will not be available yet
## `beforeCompile`
- Called right before the compilation starts
## `compiled`
- Called after the compilation is finished
- At this stage **all directives have been linked so data changes will trigger DOM updates**
- `$el` is not guaranteed to have been inserted into the document yet
## `activate`
- Called after compilation is finished, right before the `ready` hook - but only during dynamic component swapping or in the initial render for static components
- It accepts a **`done` callback**, which **must be called for the rest of the lifecycle to complete**
- It’s most useful for performing some asynchronous operation before a component is **swapped** in, like fetching data from an API
## `ready`
- Called after compilation and the `$el` is inserted into the document for the first time, i.e. **right after the first `attached` hook**
- This insertion **must be executed via Vue** (with methods like `vm.$appendTo()` or as a result of a directive update) to trigger the `ready` hook
## `attached`
- Called when `vm.$el` is attached to DOM by a directive or a VM instance method such as `$appendTo()`
- Direct manipulation of `vm.$el` will not trigger this hook
## `detached`
- Called when `vm.$el` is removed from the DOM by a directive or a VM instance method
- Direct manipulation of `vm.$el` will not trigger this hook
## `beforeDestroy`
- Called right before a Vue instance is destroyed
- At this stage the instance is still fully functional
## `destroyed`
- Called after a Vue instance has been destroyed
- When this hook is called, all bindings and directives of the Vue instance have been unbound and all child Vue instances have also been destroyed
- If there is a leaving transition, the `destroyed` hook is called after the transition has finished

![](https://v1.vuejs.org/images/lifecycle.png)
# Options / Misc
## `events`
- An object where keys are events to listen for and values are the corresponding callbacks
- These are Vue events rather than DOM events
- The value can also be a string of a method name
- The Vue instance will call `$on()` for each entry in the object at instantiation
## `name`
- Only respected when used in `Vue.extend()`
- Allow the component to recursively **invoke itself** in its template
    - When a component is registered globally with `Vue.component()`, the global ID is automatically set as its name
- Another benefit of specifying a `name` option is console inspection
    - When inspecting an extended Vue component in the console, the default constructor name is `VueComponent`, which isn’t very informative
    - By passing in an optional `name` option to `Vue.extend()`, you will get a better inspection output so that you know which component you are looking at
- The string will be camelized and used as the component’s constructor name
## `extends`
- Allows declaratively extending another component (could be either a plain options object or a constructor) without having to use `Vue.extend`
- This is primarily intended to make it easier to extend between single file components
- This is similar to `mixins`, the difference being that the component’s own options takes higher priority than the source component being extended
# Instance Methods / Data
[ ] codepen
## `vm.$data` (`Object`)
- The data object that the Vue instance is observing
- Can swap it with a new object
- The Vue instance proxies access to the properties on its data object
## `vm.$el` (`HTMLElement`, read only)
- The DOM element that the Vue instance is managing
- For Fragment Instances, `vm.$el` will return an anchor node that indicates the starting position of the fragment
## `vm.$options` (`Object`, read only)
- The instantiation options used for the current Vue instance
- Useful when you want to include custom properties in the options
	
    ```js
    new Vue({
        customOption: 'foo',
        created: function () {
            console.log(this.$options.customOption) // -> 'foo'
        }
    })
    ```

## `vm.$parent` (Vue instance, read only)
- The parent instance, if the current instance has one
## `vm.$root` (Vue instance, read only)
- The root Vue instance of the current component tree
    - If the current instance has no parents this value will be itself