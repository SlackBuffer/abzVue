var vm = new Vue({
  el: '#app',
  data: {
      message: 'Hello Vue!',
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue.js' },
        { text: 'Build Something Awesome' }
      ],
      toggle: '',
      a: { status: 'checked' },
      b: { status: 'unchecked' }
  },
  methods: {
    reverseMessage: function() {
      this.message = this.message.split('').reverse().join('')
    },
    addTodo: function() {
      var text = this.newTodo.trim()
      if (text) {
        this.todos.push({ text: text })
        this.newTodo = ""
      }
    },
    removeTodo: function(index) {
      this.todos.splice(index, 1)
    }
  }
})