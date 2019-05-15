- In-template expressions are very convenient, but they are really meant for simple operations only
    - Templates are meant to describe the structure of your **view**. Putting too much logic into your templates can make them bloated and hard to maintain
    - This is why Vue.js limits binding expressions to one expression only
- For any logic that requires more than one expression, you should use a computed property

    ```html
    <div id="example">
        a={{ a }}, b={{ b }}
    </div>
    ```

    ```js
    var vm = new Vue({
        el: '#example',
        data: {
            a: 1
        },
        computed: {
            // a computed getter
            b: function () {
                // `this` points to the vm instance
                return this.a + 1
            }
        }
    })
    ```

- Computed property vs `$watch`
- Vue.js does provide an API method called `$watch` that allows you to observe data changes on a Vue instance
- It is often a better idea to use a computed property rather than an imperative `$watch` callback

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

- Computed setter
    - Computed properties are by default getter-only, but you can also provide a setter when you need it

    ```js
    // ...
    computed: {
        fullName: {
            // getter
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            // setter
            set: function (newValue) {
                var names = newValue.split(' ')
                this.firstName = names[0]
                this.lastName = names[names.length - 1]
            }
        }
    }
    // ...
    ```

