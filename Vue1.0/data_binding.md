- Vue.js uses a DOM-based templating implementation
    - This means that all Vue.js templates are essentially valid, parsable HTML enhanced with some **special attributes**
- The text put inside mustache tags are called **binding expressions**
## Interpolations
- Text

    ```html
    <span>Message: {{ msg }}</span>
    // one-time interpolations that do not update on data change
    <span>This will never change: {{* msg }}</span>
    ```

- Raw HTML

    ```html
    <div>{{{ raw_html }}}</div>
    ```

    - The contents are inserted as plain HTML - data binding are ignored
- [ ] Use partials if you need to reuse template pieces
	
    ```js
    // registering a partial
    Vue.partial('my-partial', '<p>This is a partial! {{msg}}</p>')
    ```

    ```html
    <!-- a static partial -->
    <partial name="my-partial"></partial>

    <!-- a dynamic partial -->
    <!-- renders partial with id === vm.partialId -->
    <partial v-bind:name="partialId"></partial>
    <!-- dynamic partial using v-bind shorthand -->
    <partial :name="partialId"></partial>
    ```

    - `<partial>` elements serve as outlets for registered template partials
    - Partial contents are also compiled by Vue when inserted. The `<partial>` element itself will be replaced
    - It requires a `name` attribute which will be used to resolve the partial’s content
- Attributes

    ```js
    <div id="item-{{ id }}"></div>
    ```

    - Attribute interpolations are **disallowed in Vue.js directives and special attributes**
    - Attribute interpolations are translated into `v-bind` bindings internally
## Bind expressions
- In Vue.js, a binding expression consists of a single JavaScript expression optionally followed by one or more filters
- JS expressions

    ```js
    {{ number + 1 }}
    {{ ok ? 'YES' : 'NO' }}
    {{ message.split('').reverse().join('') }}
    ```

    - These expressions will be **evaluated in the data scope of the owner Vue instance**
    - Each binding can only contain 1 single expression
    
    ```js
    // this is a statement, not an expression:
    {{ var a = 1 }}
    // flow control won't work either, use ternary expressions
    {{ if (ok) { return message } }}
    ```
    
- Filters
    - Vue.js allows you to append optional “filters” to the end of an expression, denoted by the “pipe” symbol `|`
    - The pipe syntax is not part of JavaScript syntax, therefore you cannot mix filters inside expressions; you can only append them at the end of an expressions
    - Vue.js provides a number of built-in filters
    - Filters can be chained
    - Filters can take arguments
        - The filter function always receives the expression’s value as the first argument
        - Quoted arguments are interpreted as plain string, while un-quoted ones will be evaluated as expressions
    
    ```js
    // built-in `capitalize` filter
    {{ message | capitalize }}
    {{ message | filterA | filterB }}
    {{ message | filterA 'arg1' arg2 }}
    ```
    
## Directives        
- Directives are special attributes with the `v-` prefix
- Directive attribute **values** are expected to be binding expressions, so the rules about JavaScript expressions and filters mentioned above apply here as well
- A directive’s job is to **reactively apply special behavior to the DOM** when the value of its ***expression*** changes

    ```html
    <!-- the `v-if` directive would remove/insert the `<p>` element based on the truthiness of the value of the expression `greeting` -->
    <p v-if="greeting">Hello!</p>
    ```

- Arguments
    - Some directives can take an “argument”, denoted by a colon `:` after the directive name
    
    ```html
    <a v-bind:href="url"></a>
    <!-- this achieves the same result; attribute interpolations are translated into v-bind bindings internally -->
    <a href="{{url}}"></a>

    <a v-on:click="doSomething">
    ```
    
- Modifiers
    - Modifiers are special postfixes denoted by a dot `.`, which indicate that a directive should be **bound in some special way**
    
    ```html
    <!-- the `.literal` modifier tells the directive to interpret its attribute value as a literal string rather than an expression -->
    <a v-bind:href.literal="/a/b/c"></a>
    ```
    
## Shorthand
- The `v-` prefix serves as a **visual cue** for identifying Vue-specific attributes in the templates
    - This is useful when you are using Vue.js to **apply dynamic behavior to some existing markup**, but can feel verbose for some frequently used directives
- At the same time, the need for the `v-` prefix becomes less important when you are building an SPA where Vue.js manages every template
- Vue.js provides special shorthands for 2 of the most often used directives, `v-bind` and `v-on`

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

- All Vue.js supported browsers can parse it correctly, and they do not appear in the final rendered markup