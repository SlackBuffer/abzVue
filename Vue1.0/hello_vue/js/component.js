// define
var MyComponent = Vue.extend({
  template: '<div>A custom component!</div>'
})
// register
Vue.component('my-component', MyComponent)

var Child = Vue.extend({
  template: '<div>Child only available in Parent</div>'
})
var Parent = Vue.extend({
  template: '<div>Parent div<child-component></child-component></div>',
  components: {
    'child-component': Child
  }
})
Vue.component('parent-component', Parent)

Vue.component(
  'sugar-component', {
    props: ['myMsg', 'myMessage'],
    template: '<div>{{ myMsg }}, registration sugar{{ myMessage }}</div>'
  }
)

Vue.component('parent-sugar', {
  template: '<div>parent sugar<child-sugar></child-sugar></div>',
  components: {
    'child-sugar': {
      template: '<div>child sugar</div>'
    }
  }
})

// [x] 
Vue.component('child', {
  template: '#child-template',
  data: function() {
    return { msg: 'hello' }
  },
  methods: {
    notify: function() {
      if (this.msg.trim()) {
        this.$dispatch('child-msg', this.msg)
        this.msg = ''
      }
    }
  }
})

Vue.component(
  'single-slot', {
  template: '<div><h1>This is my component!</h1><slot>This will only be displayed if there is no content to be distributed.</slot></div>'
})

Vue.component('named-slot', {
  template: `<div>
                <slot name="one"></slot>
                <slot></slot>
                <slot name="two"></slot>
              </div>`
})

// create a root instance
var home = '<div><my-component></my-component>home</div>'
var parent = new Vue({
  el: '#example',
  data: {
    parentMsg: '.....',
    messages: [],
    currentView: 'home'
  },
  // 引用组件
  components: {
    home: { template: home },
    posts: { template: '<div>posts</div>' },
    archive: { template: '<div>archive</div>' }
  },
  methods: {
    handleIt: function(msg) {
      this.messages.push(msg)
    }
  }
})

console.log(parent.$refs.firstChild)