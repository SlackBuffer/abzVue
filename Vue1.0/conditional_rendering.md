- `v-if`

    ```html
    <h1 v-if="ok">Yes</h1>
    ```

- Template `v-if` (toggle more than one element)

    ```html
    <template v-if="ok">
        <h1>Title</h1>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
    </template>
    ```

    - `<template>` element serves as an **invisible wrapper**. The final rendered result will not include the `<template>` element
- `v-show`

    ```html
    <h1 v-show="ok">Hello!</h1>
    ```

    - An element with `v-show` will always be rendered and remain in the DOM; `v-show` simply **toggles the `display`** CSS property of the element
    - **`v-show` doesn’t support the `<template>` syntax**
- `v-else`

    ```html
    <div v-if="Math.random() > 0.5">
        Sorry
    </div>
    <div v-else>
        Not sorry
    </div>
    ```

    - Indicate an “else block” for `v-if` or `v-show`
    - Must **immediately follow the `v-if` or `v-show` element** - otherwise it will not be recognized
## `v-if` vs `v-show`
- Generally speaking, `v-if` has higher toggle costs while `v-show` has higher initial render costs
    - So prefer `v-show` if you need to toggle something very often, and prefer `v-if` if the condition is unlikely to change at runtime
- When a `v-if` block is toggled, Vue.js will have to perform a partial compilation/teardown process, because the template content inside `v-if` can also contain data bindings or child components
- `v-if` is “real” conditional rendering because it ensures that event listeners and child components inside the conditional block are properly destroyed and re-created during toggles
- `v-if` is also **lazy**: if the condition is false on initial render, it will not do anything - partial compilation won’t start until the condition becomes true for the first time (and the compilation is subsequently cached)
- `v-show` is much simpler - the element is always compiled and preserved, with just simple CSS-based toggling
## Component caveat
- When used with components and `v-show`, `v-else` doesn’t get applied properly due to [ ] **directives priorities**

    ```html
    <!-- problematic -->
    <custom-component v-show="condition"></custom-component>
    <p v-else>This could be a component too</p>

    <!-- replace the `v-else` with another `v-show` -->
    <custom-component v-show="condition"></custom-component>
    <p v-show="!condition">This could be a component too</p>
    ```


- It does work as intended with `v-if`