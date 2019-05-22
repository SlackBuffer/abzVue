# Components
- Components are **custom elements that Vue.js’ compiler would attach specified behavior to**
    - In some cases, they may also appear as a native HTML element extended with the special `is` attribute
## Using components
- Registration
	
    ```js
    // create a component constructor
    var MyComponent = Vue.extend({
        // options
    })
    // register to use the constructor as a component
    // globally register the component with tag: my-component
    Vue.component('my-component', MyComponent)
    new Vue({
        el: '#example'
    })
    ```

    ```html
    <div id="example">
        <my-component></my-component>
    </div>
    ```    

    - Once registered, the component can now be used in a parent instance’s template as a custom element `<my-component>`
    - Make sure the component is **registered before you instantiate your root Vue instance**
    - The component’s `template` replaces the custom element, which only serves as a mounting point
        - This behavior can be configured using the `replace` instance option
    - Components are provided a template instead of mounting with the `el` option. Only the **root Vue instance** (defined using `new Vue`) will include an `el` to mount to
    - > Vue.js does not enforce the W3C rules for custom tag-names (all-lowercase, must contain a hyphen) though following this convention is considered good practice
- Local registration
    - You don’t have to register every component globally. You can make a component available only in the scope of another component by registering it with the `components` instance option
    - The same **encapsulation** applies for other assets types such as directives, filters and transitions
- Registration **sugar**
    - Directly pass in the options object instead of an actual constructor to `Vue.component()` and the component option. Vue.js will **automatically call `Vue.extend()`** for you under the hood
- **Component option caveats**
    - Most of the options that can be passed into the Vue constructor can be used in `Vue.extend()`, with two special cases: **`data`** and **`el`**
    	
        ```js
        var data = { a: 1 }
        var MyComponent = Vue.extend({
            data: data
        })
        var MyComponent = Vue.extend({
            data: function () {
                return { a: 1 }
            }
        })
        ```
    
        - The problem with this is that the same `data` object will be shared across all instances of `MyComponent`, which is most likely not what we want
        - We should use a function that returns a fresh object as the `data` option
    - The `el` option also requires a function value when used in `Vue.extend()`, for exactly the same reason
- Template parsing
    - Vue.js template engine is DOM-based and uses native parser that comes with the browser instead of providing a custom one
    - **Templates have to be individually valid pieces of HTML**
    - Some HTML elements have restrictions on what elements can appear inside them. Most common of these restrictions are
        - `a` can not contain other interactive elements (e.g. buttons and other links)
        - `li` should be a direct child of `ul` or `ol`, and both `ul` and `ol` can only contain `li`
        - `option` should be a direct child of `select`, and `select` can only contain `option` (and `optgroup`)
        - `table` can only contain `thead`, `tbody`, `tfoot` and `tr`, and these elements should be direct children of `table`
        - `tr` can only contain `th` and `td`, and these elements should be direct children of `tr`
    - Although in simple cases it might appear to work, you **can not rely on custom elements being expanded before browser validation**
        - E.g. `<my-select><option>...</option></my-select>` is not a valid template even if `my-select` component eventually expands to `<select>...</select>`
    - Another consequence is that you can not use custom tags (including custom elements and special tags like `<component>`, `<template>` and `<partial>`) inside of `select`, `table` and other elements with similar restrictions. Custom tags will be **hoisted out** and thus not render properly
        - In case of a custom element you should use the `is` special attribute
        	
            ```html
            <table>
                <tr is="my-component"></tr>
            </table>
            ```
        
        - In case of a `<template>` inside of a `<table>` you should use `<tbody>`, as tables are allowed to have multiple `tbody`
        	
            ```html
            <table>
                <tbody v-for="item in items">
                    <tr>Even row</tr>
                    <tr>Odd row</tr>
                </tbody>
            </table>
            ```
        
## `props`
- **Every component instance has its own isolated scope**
    - This means you cannot (and should not) directly reference parent data in a child component’s template
- Data can be passed down to child components using `props`
- A “prop” is a field on a component’s data that is expected to be passed down from its parent component
- A child component needs to explicitly declare the props it expects to receive using the `props` option
- HTML attributes are **case-insensitive**. When using camelCased prop names as attributes, you need to use their kebab-case (hyphen-delimited) equivalents
    - html 中用 kebab-case 的属性在 `props` 中要用 camel cased
    - > https://codepen.io/slackbuffer/pen/gJXVZQ?editors=1010
- 用 `v-bind` 动态绑定 [ ] 父组件的 props
    - > https://codepen.io/slackbuffer/pen/gJXVZQ?editors=1010
- Literal vs dynamic
	
    ```html
    <!-- Since this is a literal prop, its value is passed down as a plain string "1", instead of an actual number -->
    <comp some-prop="1"></comp>
    <!-- this passes down an actual number -->
    <comp :some-prop="1"></comp>
    ```

    - If we want to pass down an actual JavaScript number, we need to use the dynamic syntax to make its value be **evaluated as a JavaScript expression**
- By default, all props form a **one-way-down** binding between the child property and the parent one: when the parent property updates, it will flow down to the child, but not the other way around
    - This default is meant to prevent child components from accidentally mutating the parent’s state, which can make your app’s data flow harder to reason about
    - It is also possible to explicitly enforce a two-way or a one-time binding with the `.sync` and `.once` binding type modifiers
        
        ```js
        <!-- default, one-way-down binding -->
        <child :msg="parentMsg"></child>
        <!-- explicit two-way binding -->
        <child :msg.sync="parentMsg"></child>
        <!-- explicit one-time binding -->
        <child :msg.once="parentMsg"></child>
        ```

        - The two-way binding will sync the change of child’s `msg` property back to the parent’s `parentMsg` property
        The one-time binding, once set up, will not sync future changes between the parent and the child
    - Note that if the prop being passed down is an Object or an Array, it is passed by **reference**. Mutating the Object or Array itself inside the child will affect parent state, **regardless** of the binding type you are using
- Props validation
	
    ```js
    Vue.component('example', {
        props: {
            // basic type check (`null` means accept any type)
            propA: Number,
            // multiple possible types (1.0.21+)
            propM: [String, Number],
            // a required string
            propB: {
                type: String,
                required: true
            },
            // a number with default value
            propC: {
                type: Number,
                default: 100
            },
            // object/array defaults should be returned from a
            // factory function
            propD: {
                type: Object,
                default: function () {
                    return { msg: 'hello' }
                }
            },
            // indicate this prop expects a two-way binding. will
            // raise a warning if binding type does not match
            propE: {
                twoWay: true
            },
            // custom validator function
            propF: {
                validator: function (value) {
                    return value > 10
                }
            },
            // coerce function (new in 1.0.12)
            // cast the value before setting it on the component
            propG: {
                coerce: function (val) {
                    return val + '' // cast the value to string
                }
            },
            propH: {
                coerce: function (val) {
                    return JSON.parse(val) // cast the value to Object
                }
            }
        }
    })
    ```

    - The `type` can be one of the following native constructors: String, Number, Boolean, Function, Object, Array
    - `type` can also be a custom constructor function and the assertion will be made with an `instanceof` check
    - **When a prop validation fails, Vue will refuse to set the value on the child component**, and throw a **warning** if using the development build
## Parent-child communication
- A child component holds access to its parent component as **`this.$parent`**
- A root Vue instance will be available to all of its descendants as **`this.$root`**
- Each parent component has an **array**, `this.$children`, which contains all its child components
- Although it’s possible to access any instance in the parent chain, you should **avoid directly relying on parent data in a child component and prefer passing data down explicitly using props**
- It is a **very bad idea** to mutate parent state from a child component
    1. Makes the parent and child tightly coupled
    2. Makes the parent state much harder to reason about when looking at it alone, because its state may be modified by any child
        - Ideally, only a component itself should be allowed to modify its own state
- All [ ] Vue instances (deduction: including Vue components) implement a custom event interface that facilitates communication within a component tree
    - This event system is independent from the native DOM events and works differently
- Each Vue instance is an event emitter that can:
    - Listen to events using `$on()`
    - Trigger events on self using `$emit()`
    - Dispatch an event that propagates upward along the parent chain using `$dispatch()`
    - Broadcast an event that propagates downward to all descendants using `$broadcast()`
- Unlike DOM events, **Vue events will automatically stop propagation after triggering callbacks for the first time along a propagation path, unless the callback explicitly returns `true`**
- https://v1.vuejs.org/guide/components.html#Custom-Events
    - The example above is pretty nice, but when we are looking at the parent’s code, it’s not so obvious where the `"child-msg"` event comes from
    - It would be better if we can declare the event handler in the template, right where the child component is used
- `v-on` can be used to listen for custom events when used on a child component
	
    ```html
    <child v-on:child-msg="handleIt"></child>
    ```

    - When the child triggers the `"child-msg"` event, the parent’s `handleIt` method will be called
    - Any code that affects the parent’s state will be inside the `handleIt` parent method
    - The child is only concerned with triggering the event
- Assign a reference ID to the child component using **`v-ref`** to directly access a child component in JavaScript
    - When `v-ref` is used together with `v-for`, the ref you get will be an Array or an Object containing the child components mirroring the data source
## Content distribution with slots
- 类似于 React 的 `children`
- **slots 写在组件 `templates` 里**
- When using components, it is often desired to compose them like this
	
    ```html
    <app>
        <app-header></app-header>
        <app-footer></app-footer>
    </app>
    ```

    - The `<app>` component does not know what content may be present inside its mount target. It is decided by whatever parent component that is using `<app>`
    - The `<app>` component very likely has its own template
- Compilation scope
	
    ```html
    <!-- `msg` 会绑定到 `child-component` 的父组件的 `data`，因为
    `msg` 在父组件的模板里 -->
    <child-component>
        {{ msg }}
    </child-component>
    ```

    - **Everything in the parent template is compiled in parent scope; everything in the child template is compiled in child scope**
    - A common mistake is trying to bind a directive to a child property/method in the parent template
    	
        ```html
        <!-- does NOT work -->
        <!-- 此为 `child-component` 的父组件的模板 -->
        <child-component v-show="someChildProperty"></child-component>
        ```
    
        - Assuming `someChildProperty` is a property on the child component, the example above would not work as intended
        - > The parent’s template should not be aware of the state of a child component
        - If you need to bind child-scope directives on a component root node, you should do so in the child component’s own template
        	
            ```js
            Vue.component('child-component', {
                // this does work, because we are in the right scope
                template: '<div v-show="someChildProperty">Child</div>',
                data: function () {
                    return {
                        someChildProperty: true
                    }
                }
            })
            ```

    - Similarly, distributed content will be compiled in the parent scope
- Single slot
    - Parent content will be discarded unless the child component template contains at least one `<slot>` outlet
        - > https://codepen.io/slackbuffer/pen/wbpvgd?editors=1010#0
    - When there is only one slot with no attributes, the entire content fragment will be inserted at its position in the DOM, replacing the slot itself
    - Anything originally inside the `<slot>` tags is considered fallback content
        - Fallback content is compiled in the child scope and will only be displayed if the hosting element is empty and has no content to be inserted
- Named slots
    - `<slot>` elements have a special attribute, `name`, which can be used to further customize how content should be distributed
    - You can have multiple slots with different names
    - A named slot will match any element that has a corresponding `slot` attribute in the content fragment
    - There can still be **one unnamed slot**, which is the default slot that serves as a **catch-all** outlet for any unmatched content
        - **If there is no default slot, unmatched content will be discarded**
- The content distribution API is a very useful mechanism when designing components that are meant to be **composed** together
## **Dynamic components**
- You can use the same mount point and dynamically switch between multiple components by using the reserved `<component>` element and dynamically bind to its `is` attribute
	
    ```js
    new Vue({
        el: 'body',
        data: {
            currentView: 'home'
        },
        components: {
            home: { /* ... */ },
            posts: { /* ... */ },
            archive: { /* ... */ }
        }
    })
    ```
	
    ```html
    <component :is="currentView">
    <!-- component changes when `vm.currentview` changes! -->
    </component>
    ```

- `keep-alive`
    - Add a `keep-alive` directive param to keep the switched-out components alive so that its state can be preserved and re-rendering can be avoided
	
    ```html
    <component :is="currentView" keep-alive>
        <!-- inactive components will be cached! -->
    </component>
    ```

- When switching components, the incoming component might need to perform some asynchronous operation before it should be swapped in. To control the timing of component swapping, implement the `activate` hook on the incoming component
	
    ```js
    Vue.component('active-example', {
        activate: function(done) {
            var self = this
            loadDataAsync(function(data) {
                self.someData = data
                done()
            })
        }
    })
    ```

    - The `activate` hook is only respected during dynamic component **swapping** or the **initial render** for static components - it does not affect manual insertions with instance methods
- The `transition-mode` specifies how the transition between 2 dynamic components should be executed
- By default, the transitions for incoming and outgoing components happen simultaneously. The attribute supports 2 other mode
    - `in-out`: New component transitions in first, current component transitions out after incoming transition has finished
    - `out-in`: Current component transitions out first, new component transitions in after outgoing transitions has finished
	
    ```html
    <!-- fade out first, then fade in -->
    <component
        :is="view"
        transition="fade"
        transition-mode="out-in"
    </component>
    ```
	
    ```css
    fade-transition {
        transition: opacity .3s ease;
    }
    .fade-enter, .fade-leave {
        opacity: 0;
    }
    ```

## Misc
### Components and `v-for`
	
```html
<my-component v-for="item in items"></my-component>
```

- This won't pass any data to the component because **components have isolated scopes of their own**
- In order to pass the iterated data to the component, use props too

    ```html
    <my-component
        v-for="item in items"
        :item="item"
        :index="$index">
    </my-component>
    ```

    - The reason for not automatically injecting `item` into the component is because that makes the component tightly coupled to how `v-for` works. Being explicit about where its data comes from makes the component reusable in other situations
### Reusable components
- When authoring components, it is good to keep in mind whether you intend to reuse this component somewhere else later
    - It is OK for one-off components to have some tight coupling with each other, but reusable components should define a clean public interface
- The API for a Vue.js component essentially comes in 3 parts - props, events and slots
    - Props allow the external environment to feed data to the component;
    - Events allow the component to trigger actions in the external environment;
    - **Slots allow the external environment to insert content into the component’s view structure**
	
    ```html
    <my-component
        :foo="baz"
        :bar="qux"
        @event-a="doThis"
        @event-b="doThat">
        <!-- content -->
        <img slot="icon" src="...">
        <p slot="main-text">Hello!</p>
    </my-component>
    ```

### Async components
- In large applications, we may need to divide the app into smaller chunks, and only load a component from the server when it is actually needed
- Vue.js allows you to define your component as a factory function that asynchronously resolves your component definition
- Vue.js will only trigger the factory function when the component actually needs to be rendered, and will cache the result for future re-renders
	
    ```js
    Vue.component('async-example', function (resolve, reject) {
        setTimeout(function () {
            resolve({
                template: '<div>I am async!</div>'
            })
        }, 1000)
    })
    ```

- The factory function receives a `resolve` callback, which should be called when you have retrieved your component definition from the server. You can also call `reject(reason)` to indicate the load has failed
### **Assets naming convention**
- Some assets, such as components and directives, appear in templates in the form of HTML attributes or HTML custom tags
- Since HTML attribute names and tag names are case-insensitive, we often need to name our assets using kebab-case instead of camelCase, which can be a bit inconvenient
- Vue.js actually supports naming your assets using camelCase or PascalCase, and automatically resolves them as kebab-case in templates (similar to the name conversion for props)
	
    ```js
    // in a component definition
    components: {
        // register using camelCase
        myComponent: { /* ... */ }
    }
    // PascalCase
    import TextBox from './components/text-box';
    import DropdownMenu from './components/dropdown-menu';
    export default {
        components: {
            // use in templates as <text-box> and <dropdown-menu>
            TextBox,
            DropdownMenu
        }
    }
    ```
	
    ```html
    <!-- use dash case in templates -->
    <my-component></my-component>
    ```

### Recursive component
- Components can recursively invoke itself in its own template, however, it can only do so when it has the `name` option
	
    ```js
    var StackOverflow = Vue.extend({
        name: 'stack-overflow',
        template:
            '<div>' +
            // recursively invoke self
                '<stack-overflow></stack-overflow>' +
            '</div>'
    })
    ```

    - A component like the above will result in a “max stack size exceeded” error, so make sure recursive invocation is **conditional**
- When you register a component globally using `Vue.component()`, the [ ] global ID is automatically set as the component’s `name` option
### Fragment instance
- When you use the template option, the content of the template will replace the element the Vue instance is mounted on. It is therefore recommended to always have a single root-level, plain element in templates
	
    ```html
    <div>root node 1</div>
    <div>root node 2</div>

    <!-- prefer this -->
    <div>
        I have a single root node!
        <div>node 1</div>
        <div>node 2</div>
    </div>
    ```

- Conditions that will turn a Vue instance into a fragment instance
    1. Template contains multiple top-level elements
    2. Template contains **only plain text**
    3. Template contains **only another component** (which can potentially be a fragment instance itself)
    4. Template contains [ ] only an element directive, e.g. `<partial>` or vue-router’s `<router-view>`
    4. Template root node has a flow-control directive, e.g. `v-if` or `v-for`
- The reason is that all of the above cause the instance to have an unknown number of top-level elements, so it has to manage its DOM content as a fragment
- A fragment instance will still render the content correctly. However, it will **not have a root node**, and its **`$el` will point to an “anchor node”**, which is an **empty** Text node (or a Comment node in debug mode)
- What’s more important though, is that **non-flow-control directives**, **non-prop attributes** and **transitions** on the component element will be ignored, because there is **no root element to bind them to**
- There are, of course, valid use cases for fragment instances, but it is in general a good idea to give your component template a single, plain root element
    - It ensures directives and attributes on the component element to be properly transferred, and also results in slightly better performance
### Inline template
- When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content
- This allows more flexible template-authoring
- `inline-template` makes the scope of your templates harder to reason about, and makes the component’s template compilation un-cachable
- As a best practice, prefer defining templates inside the component using the `template` option