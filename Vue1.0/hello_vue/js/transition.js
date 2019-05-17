Vue.transition('expand', {
  leaveClass: 'customLeaveClassName',
  beforeEnter: function (el) {
    console.log('before enter')
    el.textContent = 'beforeEnter'
  },
  enter: function (el) {
    console.log('enter')
    el.textContent = 'enter'
  },
  afterEnter: function (el) {
    console.log('after enter')
    el.textContent = 'afterEnter'
  },
  enterCancelled: function (el) {
    // handle cancellation
  },
  beforeLeave: function (el) {
    console.log('before leave')
    el.textContent = 'beforeLeave'
  },
  leave: function (el) {
    console.log('leave')
    el.textContent = 'leave'
  },
  afterLeave: function (el) {
    console.log('after leave')
    el.textContent = 'afterLeave'
  },
  leaveCancelled: function (el) {
    // handle cancellation
  }
})

Vue.transition('fade', {
  css: false,
  enter: function (el, done) {
    // element is already inserted into the DOM
    // call done when animation finishes
    $(el)
      .css('opacity', 0)
      .animate({ opacity: 1 }, 1000, done)
  },
  enterCancelled: function (el) {
    $(el).stop()
  },
  leave: function (el, done) {
    // same as enter
    $(el).animate({ opacity: 0 }, 1000, done)
  },
  leaveCancelled: function (el) {
    $(el).stop()
  }
})

var vm = new Vue({
  el: '#app',
  data: {
    show: true,
    transitionName: 'expand',
    query: '',
    list: [
        { msg: 'Bruce Lee' },
        { msg: 'Jackie Chan' },
        { msg: 'Chuck Norris' },
        { msg: 'Jet Li' },
        { msg: 'Kung Fury' }
    ]
  },
  methods: {
    handleToggle: function() {
      this.show = !this.show
    }
  }
})