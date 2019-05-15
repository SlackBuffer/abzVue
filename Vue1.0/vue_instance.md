- Every Vue.js app is bootstrapped by creating a root Vue instance with the `Vue` constructor function

    ```js
    var vm = new Vue({
        // options
    })
    ```

- A Vue instance is essentially a ViewModel as defined in the MVVM pattern, hence the variable name `vm` you will see throughout the docs
- The Vue constructor can be extended to create reusable component constructors with pre-defined options

    ```js
    var MyComponent = Vue.extend({
    // extension options
    })
    // all instances of `MyComponent` are created with
    // the pre-defined extension options
    var myComponentInstance = new MyComponent()
    ```

- All Vue.js components are essentially extended Vue instances
- Each Vue instance goes through a series of initialization steps when it is created - for example, it needs to set up data observation, compile the template, and create the necessary data bindings
- Along the way, it will also invoke some lifecycle hooks, which give us the opportunity to execute custom logic

    ```js
    var vm = new Vue({
        data: {
            a: 1
        },
        created: function () {
            // `this` points to the vm instance
            console.log('a is: ' + this.a)
        }
    })
    // -> "a is: 1"
    ```

- All lifecycle hooks are called with their `this` context pointing to the Vue instance invoking it
- There are no controllers in Vue.js. Your custom logic for a component would be split among these lifecycle hooks
![](https://v1.vuejs.org/images/lifecycle.png)