# List rendering
## `v-for`
- Use the `v-for` directive to render a list of items based on an Array
- The `v-for` directive requires a special syntax in the form of `item in items`, where `items` is the source data Array and `item` is an alias for the Array element being iterated on
- Inside `v-for` blocks we have full access to parent scope properties, plus a special variable `$index` which is the Array index for the current item

    ```html
    <ul id="example-2">
        <li v-for="item in items">
            {{ parentMessage }} - {{ $index }} - {{ item.message }}
        </li>
    </ul>
    ```

    ```js
    var example2 = new Vue({
        el: '#example-2',
        data: {
            parentMessage: 'Parent',
            items: [
                { message: 'Foo' },
                { message: 'Bar' }
            ]
        }
    })
    ```

- Can also specify an **alias** for the index (or the key if `v-for` is used on an Object)

    ```html
    <div v-for="(index, item) in items">
        {{ index }} {{ item.message }}
    </div>
    ```

- Starting in 1.0.17 you can also use `of` as the delimiter instead of `in`, so that it is closer to JavaScript syntax for iterators

    ```html
    <div v-for="item of items"></div>

    <!-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of -->
    <!-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in -->
    ```

## Template `v-for`

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

## Array change detection
### Mutation methods
- Vue.js wraps an observed Array’s mutation methods so they will also trigger View updates
- The wrapped methods are:
    - `push()`
    - `pop()`
    - `shift()`
    - `unshift()`
    - `splice()`
    - `sort()`
    - `reverse()`
### Replacing an array
- When working with non-mutating methods (e.g. `filter()`, `concat()` and `slice()`), you can just replace the old Array with the new one
    - You might think this will cause Vue.js to throw away the existing DOM and re-render the entire list - luckily that is not the case
    - Vue.js implements some smart heuristics to maximize DOM element reuse, so replacing an array with another array containing overlapping objects is a very efficient operation
### `track-by`
- By default `v-for` determines the reusability of existing **scopes** and **DOM elements** by tracking the **identity** of its data object, this could cause the entire list to be re-rendered
- If each of your data objects has a unique `id` property, then you can use a `track-by` special attribute to give Vue.js a hint so that it can reuse existing instances as much as possible

    ```html
    <div v-for="item in items" track-by="_uid">
        <!-- content -->
    </div>
    ```

    ```js
    {
        items: [
            { _uid: '88f869d', ... },
            { _uid: '7496c10', ... }
        ]
    }
    ```

### `track-by="$index"`
- If you don’t have a unique key to track by, you can also use `track-by="$index"`, which will force `v-for` into in-place update mode: fragments are **no longer moved around**, they simply get **flushed with the new value at the corresponding index**
- This can make Array replacement extremely efficient, but it comes at a trade-off
    - Because **DOM nodes are no longer moved to reflect the change in order**, temporary state like DOM input values and component private state can become out of sync (misplace)
- Be careful when using `track-by="$index"` if the `v-for` block contains form input elements or child components
### Caveats
- Due to limitations of JavaScript, Vue.js cannot detect the following changes to an Array:
    - When you directly set an item with the index, e.g. `vm.items[0] = {};`
        - Vue.js augments observed Arrays with a `$set()` method

        ```js
        // same as `example1.items[0] = ...` but triggers view update
        example1.items.$set(0, { childMsg: 'Changed!'})
        ```
    
    - When you modify the length of the Array, e.g. `vm.items.length = 0`
        - Just replace `items` with an empty array
-  Vue.js also augments Arrays with a convenience method `$remove()`, which searches for and removes an item from target Array by calling `splice()` internally    

    ```js
    var index = this.items.indexOf(item)
    if (index !== -1) {
        this.items.splice(index, 1)
    }

    this.items.$remove(item)
    ```

- When iterating over an array of objects frozen with [<u>`Object.freeze()`</u>](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze), you need to **explicitly** use a `track-by` key
    - A warning will be displayed in this scenario when Vue.js is unable to track objects automatically
## Object `v-for`
- Use `v-for` to iterate through the properties of an Object
- In addition to `$index`, each scope will have access to another special property `$key`
- When iterating over an Object, the **order** is based on the key enumeration order of `Object.keys()`, which is **not guaranteed to be consistent** in all JavaScript engine implementations
## Range `v-for`
- `v-for` can also take an integer Number. In this case it will repeat the template that many times

    ```html
    <div>
        <span v-for="n in 10">{{ n }} </span>
    </div>
    ```

## Display filtered/sorted results
- **Display** a filtered or sorted version of the Array without actually mutating or resetting the original data
    1. Create a computed property that returns the filtered or sorted Array
    2. Use the built-in `filterBy` and `orderBy` filters
        - https://v1.vuejs.org/api/#filterBy