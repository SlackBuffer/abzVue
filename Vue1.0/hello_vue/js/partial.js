// 放在 `new Vue` 前
Vue.partial('my-partial', '<p @click="sayHi">This is a partial! {{ msg }}</p>')

var vm = new Vue({
  el: '#app',
  data: {
    msg: 'message for partial'
  },
  methods: {
    sayHi: function() {
      console.log('hi')
    }
  }
})
