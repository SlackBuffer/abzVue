# Routing
- https://router.vuejs.org/
# Communication with server
- https://github.com/pagekit/vue-resource
# State management
- The **source of truth** in Vue.js applications is **the raw data object** - a Vue instance simply proxies access to it
- Therefore, if you have a piece of state that should be shared by multiple instances, you should avoid duplicating it. Instead, **share it by identity**
	
    ```js
    var sourceOfTruth = {}
    var vmA = new Vue({
        data: sourceOfTruth
    })
    var vmB = new Vue({
        data: sourceOfTruth
    })
    ```

- Extending this idea further, we would arrive at the **store pattern**
	
    ```js
    var store = {
        state: {
            message: 'hello'
        },
        actionA: function() {
            this.state.message = 'action A triggered'
        },
        actionB: function() {
            this.state.message = 'action B triggered'
        }
    }
    var vmA = new Vue({
        data: {
            privateState: {},
            sharedState: store.state
        }
    })
    var vmB = new Vue({
        data: {
            privateState: {},
            sharedState: store.state
        }
    })
    ```

    - Notice we are putting all actions that mutate the store’s state inside the store itself
    - This type of centralized state management makes it easier to understand **what type of mutations could happen to the state**, and **how are they triggered**
    - Each component can still own and manage its private state
    ![](https://v1.vuejs.org/images/state.png)
- [Vuex](https://github.com/vuejs/vuex/)
    - A Flux-inspired application architecture
# Example
- https://github.com/vuejs/vue-hackernews