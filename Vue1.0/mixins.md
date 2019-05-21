- Mixins are a flexible way to distribute reusable functionalities for Vue components
- A mixin object can contain any component options. When a component uses a mixin, all options in the mixin will be “mixed” into the component’s own options
	
    ```js
    var myMixin = {
        created: function() {
            this.hello()
        },
        methods: {
            hello: function() {
                console.log('hello from mixin')
            }
        }
    }
    var Component = Vue.extend({
        mixins: [myMixin]
    })
    var component = new Component() // -> "hello from mixin!"
    ```

- When a mixin and the component itself contain overlapping options, they will be “merged” using appropriate strategies
    - Hook functions with the same name are merged into an array so that all of them will be called. In addition, mixin hooks will be called **before** the component’s own hooks
    - Options that expect object values, for example `methods`, `components` and `directives`, will be merged into the same object. **The component’s options will take priority** when there are conflicting keys in these objects
- The same merge strategies are used in `Vue.extend()`
- Use global mixins sparsely and carefully, because it affects every single Vue instance created afterwards, including third party components
    - When used properly, this can be used to inject processing logic for custom options
    	
        ```js
        // inject a handler for `myOption` custom option
        Vue.mixin({
            created: function () {
                var myOption = this.$options.myOption
                if (myOption) {
                    console.log(myOption)
                }
            }
        })
        new Vue({
            myOption: 'hello!'
        })
        // -> "hello!"
        ```
    
        - In most cases, you should only use it for custom option handling like demonstrated in the example above
- When custom options are merged, they use the default strategy, which simply overwrites the existing value
    - If you want a custom option to be merged using custom logic, you need to attach a function to `Vue.config.optionMergeStrategies`
    	
        ```js
        Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
            // return mergedVal
        }
        ```
    
    - For most object-based options, you can simply use the same strategy used by `methods`
    	
        ```js
        var strategies = Vue.config.optionMergeStrategies
        strategies.myOption = strategies.methods
        ```