- Latest stable version: 2.6.10
- Vue 不支持 IE8 及以下版本，因为 Vue 使用了 IE8 无法模拟的 ECMAScript 5 特性（`Object.defineProperty`）。但它支持所有兼容 ECMAScript 5 的浏览器
- https://stefankrause.net/js-frameworks-benchmark8/table.html
# 对比
- Knockout 对浏览器的支持覆盖到了 IE6
## React
- React 比 Vue 更好的地方
    - 比如更丰富的生态系统
- 在 React 应用中，当某个组件的状态发生变化时，它会以该组件为根，重新渲染整个组件子树。如要避免不必要的子组件的重渲染，你需要在所有可能的地方使用 `PureComponent`，或是手动实现 `shouldComponentUpdate` 方法。同时你可能会需要使用不可变的数据结构来使得你的组件更容易被优化
    - 然而，使用 `PureComponent` 和 `shouldComponentUpdate` 时，**需要保证该组件的整个子树的渲染输出都是由该组件的 `props` 所决定的**。如果不符合这个情况，那么此类优化就会导致难以察觉的渲染结果不一致。这使得 React 中的组件优化伴随着相当的心智负担
- 在 Vue 应用中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪个组件确实需要被重渲染。你可以理解为每一个组件都已经自动获得了 `shouldComponentUpdate`，并且没有上述的子树问题限制
# VSC
- https://github.com/sidthesloth92/vsc_html5_boilerplate/issues/7#issuecomment-445700293