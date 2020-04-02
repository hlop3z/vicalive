Vue.directive('click-outside', {
  priority: 700,
  bind (el, binding) {
    this.event = function (event) {
      binding.value()
 	  }
    el.addEventListener('click', this.stopProp)
    document.body.addEventListener('click',this.event)
  },

  unbind(el) {
    el.removeEventListener('click', this.stopProp)
    document.body.removeEventListener('click',this.event)
  },
  stopProp(event) {event.stopPropagation() }
})
