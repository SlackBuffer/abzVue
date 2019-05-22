- A common need for data binding is manipulating an element’s class list and its inline styles
    - Since they are both attributes, we can use `v-bind` to handle them: we just need to calculate a final string with our expressions
    - Meddling with string concatenation is annoying and error-prone
- For this reason, Vue.js provides special enhancements when `v-bind` is used for class and style
- In addition to **Strings**, the expressions can also evaluate to **Objects** or **Arrays**
## Bind HTML classes
- Pass an Object to `v-bind:class` to dynamically toggle classes

    ```html
    <div class="static" v-bind:class="{ 'class-a': isA, 'class-b': isB }"></div>
    <!-- will render -->
    <div class="static class-a"></div>

    <!-- directly bind to an object in data -->
    <div v-bind:class="classObject"></div>
    ```
    
    ```js
    data: {
        isA: true,
        isB: false,
        classObject: {
            'class-a': true,
            'class-b': false
        }
    }
    ```
    
    - The v-bind:class directive can co-exist with the plain `class` attribute
- We can also bind to a computed property that returns an Object. This is a common and powerful pattern
- Pass an Array to `v-bind:class` to apply a list of classes

    ```html
    <div v-bind:class="[classA, classB]">
    <!-- render -->
    <div class="class-a class-b"></div>

    <!-- toggle a class in the list conditionally -->
    <div v-bind:class="[classA, isB ? classB : '']">

    <div v-bind:class="[classA, { classB: isB, classC: isC }]">
    ```
    
    ```js
    data: {
        classA: 'class-a',
        classB: 'class-b'
    }
    ```
    
    - In version 1.0.19+, it’s also possible to use the Object syntax inside Array syntax
## Bind inline styles
- `v-bind:style`

    ```html
    <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

    <div v-bind:style="styleObject"></div>

    <div v-bind:style="[styleObjectA, styleObjectB]">
    ```

    ```js
    data: {
        activeColor: 'red',
        fontSize: 30,
        styleObject: {
            color: 'red',
            fontSize: '13px'
        }
    }
    ```

    - Use either camelCase or kebab-case for the CSS property names
    - It is often a good idea to bind to a style object directly so that the template is cleaner
- The Object syntax is often used in conjunction with computed properties that return Objects
- Auto-prefixing
    - When you use a CSS property that requires vendor prefixes in `v-bind:style`, for example `transform`, Vue.js will automatically detect and add appropriate prefixes to the applied styles