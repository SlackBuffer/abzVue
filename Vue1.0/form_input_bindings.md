# Form input bindings
## Basic usage
- Use the `v-model` directive to create **two-way data bindings** on form input and textarea elements
    - It automatically picks the correct way to update the element based on the input type
- `v-model` is essentially **syntax sugar** for updating data on user input events, plus special care for some edge cases
- Text
	
    ```html
    <p>Message is: {{ message }}</p>
    <input type="text" v-model="message" placeholder="edit me">
    ```

- Multiline text
	
    ```html
    <span>Multiline message is:</span>
    <p>{{ message }}</p>
    <textarea v-model="message" placeholder="add multiple lines"></textarea>
    ```

- Checkbox
	
    ```html
    <!-- single checkbox (boolean value) -->
    <input type"checkbox" id="checkbox" v-model="checked">
    <label for="checkbox">{{ checked }}</label>

    <!-- multiple checkboxes, bound to the same Array -->
    <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
    <label for="jack">Jack</label>
    <input type="checkbox" id="john" value="John" v-model="checkedNames">
    <label for="john">John</label>
    <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
    <label for="mike">Mike</label>
    <br>
    <span>Checked names: {{ checkedNames | json }}</span>
    ```
	
    ```js
    new Vue({
        el: '...',
        data: {
            checkedNames: []
        }
    })
    ```

- Radio
	
    ```html
    <input type="radio" id="one" value="One" v-model="picked">
    <label for="one">One</label>
    <br>
    <input type="radio" id="two" value="Two" v-model="picked">
    <label for="two">Two</label>
    <br>
    <span>Picked: {{ picked }}</span>
    ```

- Select
	
    ```html
    <!-- single select -->
    <select v-model="selected">
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    <span>Selected: {{ selected }}</span>

    <!-- 按住 Command 或 Ctrl -->
    <select v-model="selected" multiple>
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </select>
    <br>
    <span>Selected: {{ selected | json }}</span>
    ```

    - Dynamic options rendered with `v-for`
    	
        ```html
        <select v-model="selected">
            <option v-for="option in options" v-bind:value="option.value">
                {{ option.text }}
            </option>
        </select>
        <span>Selected: {{ selected }}</span>
        ```
    	
        ```js
        new Vue({
            el: '...',
            data: {
                selected: 'A',
                options: [
                    { text: 'One', value: 'A' },
                    { text: 'Two', value: 'B' },
                    { text: 'Three', value: 'C' }
                ]
            }
        })
        ```
    
## Value bindings
- For radio, checkbox and select options, the `v-model` binding values are usually static strings (or booleans for checkbox)
	
    ```html
    <!-- `picked` is a string "a" when checked -->
    <input type="radio" v-model="picked" value="a">
    <!-- `toggle` is either true or false -->
    <input type="checkbox" v-model="toggle">
    <!-- `selected` is a string "abc" when selected -->
    <select v-model="selected">
        <option value="abc">ABC</option>
    </select>
    ```

- We may want to bind the value to a dynamic property on the Vue instance. We can use `v-bind` to achieve that. In addition, using `v-bind` allows us to bind the input value to non-string values
- 设置 `v-modal` 字段的值
- Checkbox
	
    ```html
    <input
        type="checkbox"
        v-model="toggle"
        v-bind:true-value="a"
        v-bind:false-value="b">
    ```
	
    ```js
    // when checked:
    vm.toggle === vm.a
    // when unchecked:
    vm.toggle === vm.b
    ```

    - [ ] Not work if `a` or `b` is an array
- Radio
	
    ```html
    <input type="radio" v-model="pick" v-bind:value="a">
    ```
	
    ```js
    // when checked:
    vm.pick === vm.a
    ```

- Select options
	
    ```html
    <select v-model="selected">
        <!-- inline object literal -->
        <option v-bind:value="{ number: 123 }">123</option>
    </select>
    ```
	
    ```js
    // when selected:
    typeof vm.selected // -> 'object'
    vm.selected.number // -> 123
    ```

## Param attributes
- `lazy`
    - By default, `v-model` syncs the input with the data after each `input` event. You can add a `lazy` attribute to change the behavior to sync after `change` events
      - `input` 在每次输入后都会触发
      - `change` 在输入值有变化后失焦的情况下触发
      - `blur` 在失焦后触发
      - > https://javascript.info/events-change-input
- `number`
    - Add a `number` attribute to `v-model` managed inputs to make user inputs be automatically persisted as numbers
    	
        ```html
        <input v-model="age" number>
        ```
    
- `debounce`
    - The `debounce` param allows you to set a minimum delay after each keystroke **before** the input’s value is **synced to the model**
    	
        ```html
        <input v-model="msg" debounce="500">
        ```
    
        - The `debounce` param does not debounce the user’s input events: it **debounces the “write” operation to the underlying data**. Therefore you should use `vm.$watch()` to react to data changes when using `debounce`
        - Use [debounce filter](https://v1.vuejs.org/api/#debounce) for debouncing real DOM events
        	
            ```html
            <input @keyup="onKeyup | debounce 500">
            ```
        
        - This can be useful when you are performing expensive operations on each update, for example making an Ajax request for type-ahead autocompletion