# Methods and event handling
## Method handler
- Use `v-on` directive to listen to DOM events

    ```html
    <div id="example">
        <button v-on:click="greet">Greet</button>
    </div>
    ```

    ```js
    var vm = new Vue({
        el: '#example',
        data: {
            name: 'Vue.js'
        },
        // define methods under the `methods` object
        methods: {
            greet: function (event) {
                // `this` inside methods point to the Vue instance
                alert('Hello ' + this.name + '!')
                // `event` is the native DOM event
                alert(event.target.tagName)
            }
        }
    })
    // you can invoke methods in JavaScript too
    vm.greet() // -> 'Hello Vue.js!'
    ```

## Inline statement handler
- Pass in the special `$event` variable to access the original DOM event

    ```html
    <button v-on:click="say('hello!', $event)">Submit</button>
    ```

    ```js
    // ...
    methods: {
        say: function (msg, event) {
            // now we have access to the native event
            event.preventDefault()
        }
    }
    ```

- Similar to the restrictions on inline expressions, event handlers are restricted to **one statement only**
## Event modifiers
- It is a very common need to call `event.preventDefault()` or `event.stopPropagation()` inside event handlers
    - Although we can do this easily inside methods, it would be better if the methods can be purely about data logic rather than having to deal with DOM event details
- To address this problem, Vue.js provides two event **modifiers** for `v-on`: `.prevent` and `.stop`
    - Modifiers are directive postfixes denoted by a dot `.`
    
    ```html
    <!-- the click event's propagation will be stopped -->
    <a v-on:click.stop="doThis"></a>
    <!-- the submit event will no longer reload the page -->
    <form v-on:submit.prevent="onSubmit"></form>

    <!-- modifiers can be **chained** -->
    <a v-on:click.stop.prevent="doThat">
    <!-- just the modifier -->
    <form v-on:submit.prevent></form>

    <!-- in 1.0.16, 2 additional modifiers have been introduced -->
    <!-- use capture mode when adding the event listener -->
    <div v-on:click.capture="doThis">...</div>
    <!-- only trigger handler if event.target is the element itself -->
    <!-- i.e. not from a child element -->
    <div v-on:click.self="doThat">...</div>
    ```
    
## Key modifiers
- When listening for keyboard events, we often need to check for common key codes
- Vue.js also allows adding key modifiers for `v-on` when listening for key events

    ```html
    <!-- only call vm.submit() when the **keyCode** is 13 -->
    <input v-on:keyup.13="submit">
    ```

- Vue.js provides aliases for most commonly used keys

    ```html
    <!-- same as above -->
    <input v-on:keyup.enter="submit">
    <!-- also works for shorthand -->
    <input @keyup.enter="submit">
    ```

- Key modifier aliases
    - enter
    - tab
    - delete (captures both “Delete” and, if the keyboard has it, “Backspace”)
    - esc
    - space
    - up
    - down
    - left
    - right
- 1.0.8+: Single letter key aliases are also supported
- 1.0.17+: You can also define custom key modifier aliases

    ```js
    Vue.directive('on').keyCodes.f1 = 112
    ```

## Why listeners in HTML
- You might be concerned that this whole event listening approach violates the good old rules about “separation of concern”
- Rest assured - since all Vue.js handler functions and expressions are **strictly bound** to the ViewModel that’s handling the current View, it won’t cause any maintenance difficulty
- In fact, there are several benefits in using `v-on`
    - It makes it easier to locate the handler function implementations within your JS code by simply skimming the HTML template
    - Since you don’t have to manually attach event listeners in JS, your **ViewModel code can be pure logic and DOM-free**. This makes it easier to test.
    - When a ViewModel is destroyed, all event listeners are **automatically** removed. You don’t need to worry about cleaning it up yourself

