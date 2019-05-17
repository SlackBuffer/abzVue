# Transitions
- With Vue.js’ transition system you can apply automatic transition effects when elements are inserted into or removed from the DOM
    - Vue.js will automatically add/remove CSS classes at appropriate times to trigger CSS transitions or animations for you
    - You can also provide JavaScript hook functions to perform custom DOM manipulations during the transition
- To apply transition effects, you need to use the special `transition` attribute on the target element
	
    ```html
    <div v-if="show" transition="my-transition"></div>
    ```

- `transition` can be used together with:
    - `v-if`
    - `v-show`
    - `v-for` (triggered for insertion and removal only, for animating changes of order use [vue-animated-list plugin](https://github.com/vuejs/vue-animated-list))
    - Dynamic components
    - On a component root node, and triggered via Vue instance DOM methods, e.g. `vm.$appendTo(el)`
- When an element with transition is inserted or removed, Vue will:
    1. Try to find a JavaScript transition hooks object registered either through `Vue.transition(id, hooks)` or passed in with the `transitions` option, using the id `"my-transition"`. If it finds it, it will call the appropriate hooks at different stages of the transition
    2. Automatically sniff whether the target element has CSS transitions or CSS animations applied, and add/remove the CSS classes at the appropriate times.
    3. If no JavaScript hooks are provided and no CSS transitions/animations are detected, the DOM operation (insertion/removal) is executed immediately on next frame
## CSS transitions
- The classes being added and toggled are based on the value of the `transition` attribute
- In the case of `transition="fade"`, 3 CSS classes are involved
    1. The class `.fade-transition` will be always present on the element
    2. `.fade-enter` defines the starting state for entering. It is applied for a single frame and then immediately removed
    3. `.fade-leave` defines the ending state for leaving. It is applied when the leaving transition starts and removed when the transition finishes
- If the `transition` attribute has no value, the classes will default to `.v-transition`, `.v-enter` and `.v-leave`
- You can specify custom `enterClass` and `leaveClass` in the transition definition. These will **override** the conventional class names
    - Useful when you want to combine Vue’s transition system with an existing CSS animation library
- Vue.js needs to attach event listeners in order to know when the transition has ended
    - It can either be `transitionend` or `animationend`, depending on the type of CSS rules applied
    - If you are only using one or the other, Vue.js can automatically detect the correct type
    - If in some cases you want to have both on the same element, for example having a CSS animation triggered by Vue, and also having a CSS transition effect on hover, you will have to explicitly declare the type you want Vue to care about
	
    ```js
    Vue.transition('bounce', {
        // Vue will now only care about `animationend` events for this transition
        type: 'animation'
    })
    ```

- Transition flow details
    - When the `show` property changes, Vue.js will insert or remove the `<div>` element accordingly, and apply transition classes as specified below:
        - When `show` becomes false, Vue.js will:
            1. Call `beforeLeave` hook
            2. Apply `v-leave` class to the element to trigger the transition
            3. Call `leave` hook
            4. Wait for the transition to finish (listening to a `transitionend` event)
            5. Remove the element from the DOM and remove `v-leave` class
            6. Call `afterLeave` hook
        - When `show` becomes true, Vue.js will:
            1. Call `beforeEnter` hook
            1. Apply `v-enter` class to the element
            1. Insert it into the DOM
            1. Call `enter` hook
            1. Force a CSS layout so `v-enter` is actually applied, then remove the `v-enter` class to trigger a transition back to the element’s original state
            1. Wait for the transition to finish
            1. Call `afterEnter` hook
    - If you remove an element when its `enter` transition is in progress, the `enterCancelled` hook will be called to give you the opportunity to clean up changes or timers created in `enter`. Vice-versa for leaving transitions
    - All of the above hook functions are called with their `this` contexts set to the associated Vue instances. It follows the same rule of **compilation scopes**: a transition’s `this` context will point to the scope it is compiled in
    - The `enter` and `leave` can optionally take a second callback argument. When you do so, you are indicating that you want to **explicitly control when the transition should end**, so instead of waiting for the CSS `transitionend` event, Vue.js will expect you to eventually call the callback to finish the transition
    	
        ```js
        enter: function (el) {
            // no second argument, transition end determined by CSS `transitionend` event
        }

        enter: function (el, done) {
            // with the second argument, the transition will only end when `done` is called
        }
        ```

    - When multiple elements are being transitioned together, Vue.js batches them and only applies one forced layout
- CSS animations are applied in the same way with CSS transitions, the difference being that `v-enter` is not removed immediately after the element is inserted, but on an `animationend` event
## JavaScript transitions
- You can also use just the JavaScript hooks without defining any CSS rules
- When using JavaScript only transitions, the `done` callbacks are required for the `enter` and `leave` hooks, otherwise they will be called synchronously and the transition will finish immediately
- It’s also a good idea to explicitly declare `css: false` for your JavaScript transitions so that Vue.js can **skip the CSS detection**. This also prevents cascaded CSS rules from accidentally interfering with the transition
## Staggering transitions
- Create staggering transitions when using `transition` with `v-for`
    - You can do this either by adding a `stagger`, `enter-stagger` or `leave-stagger` attribute to your transitioned element
    - Or, you can provide a `stagger`, `enterStagger` or `leaveStagger` hook for finer-grained control
    	
        ```js
        Vue.transition('stagger', {
            stagger: function (index) {
                // increase delay by 50ms for each transitioned item,
                // but limit max delay to 300ms
                return Math.min(300, index * 50)
            }
        })
        ```
    
- The `stagger` attribute will not affect the transition of items added or removed by `v-if` or `v-show`. Only changes to the array or object provided to `v-for` will cause transitions to stagger