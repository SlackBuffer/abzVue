# Digest
- Vue 的模板基于 DOM 实现，所有 Vue 的模板都是合法的 HTML，并拥有一些特殊的属性
- `v-` 开头是 Vue 提供的特殊属性 attributes，即指令 directives
    - 指令的职责是在与之关联的表达式的值改变后将某些行为应用到 DOM
    - 指令参数 `:`
        
        ```html
        <a v-on:click="doSomething">
        ```
    
    - 指令修饰符 `.`
        
        ```html
        <!-- the `.literal` modifier tells the directive to interpret its attribute value as a literal string rather than an expression -->
        <a v-bind:href.literal="/a/b/c"></a>
        ```
    
    - 指令简写（`v-bind`, `v-on`）
    	
        ```html
        <!-- full syntax -->
        <a v-bind:href="url"></a>
        <!-- shorthand -->
        <a :href="url"></a>
        <button v-bind:disabled="someDynamicCondition">Button</button>
        <button :disabled="someDynamicCondition">Button</button>

        <!-- full syntax -->
        <a v-on:click="doSomething"></a>
        <!-- shorthand -->
        <a @click="doSomething"></a>
        ```
    
- 属性的**插值**通过内部转成 `v-bind` 实现
	
    ```html
    <a v-bind:href="url"></a>
    <!-- this achieves the same result; attribute interpolations are translated into v-bind bindings internally -->
    <a href="{{url}}"></a>
    ```

    - 模板的插值的表达式不适合过多太多逻辑，放 **`computed`** 里
- `computed` 默认只有 getter，可定义 setter
- `computed` 对比 `$watch`

    ```html
    <div id="demo">{{fullName}}</div>
    ```

    ```js
    var vm = new Vue({
        el: '#demo',
        data: {
            firstName: 'Foo',
            lastName: 'Bar',
            fullName: 'Foo Bar'
        }
    })
    // imperative and repetitive
    vm.$watch('firstName', function (val) {
        this.fullName = val + ' ' + this.lastName
    })
    vm.$watch('lastName', function (val) {
        this.fullName = this.firstName + ' ' + val
    })

    var vm = new Vue({
        el: '#demo',
        data: {
            firstName: 'Foo',
            lastName: 'Bar'
        },
        computed: {
            fullName: function () {
                return this.firstName + ' ' + this.lastName
            }
        }
    })
    ```

- 可以用 `v-bind` 的方式指定样式，但不方便且易出错。为此，`v-bind` 用于 `class` 和 `style` 时增强了功能，除了可以解析字符串，还可以解析对象和数组
    - https://v1.vuejs.org/guide/class-and-style.html
    - Vue 会自动按需为 `v-bind:style` 里的 CSS 属性加前缀
- 条件渲染
    - `v-if=condition`
    - `v-show=condition`
    - `v-else`
- `<template>` 类似于 `<Fragment>`
- 列表渲染
    - `v-for="item in items"
    - 组件的 `v-for` 要显式地传每个 item
- 使用 `v-model` 指令对 form input 和 textarea 创建双向数据绑定
    - Automatically picks the correct way to update the element based on the input type
    - 本质上是语法糖
        - > `v-model` is essentially **syntax sugar** for updating data on user input events, plus special care for some edge cases
- 命名规范
    - 搜 naming convention
- `template`: If the string starts with `#` it will be used as a querySelector and use the selected element’s innerHTML as the template string
    - [ ] This allows the use of the common `<script type="x-template">` trick to include templates
- 打印用 <u>[`vm.$log`](https://v1.vuejs.org/api/#vm-log)</u>
- [ ] compilation scope
- [ ] frame, forced layout
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