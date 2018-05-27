oan.Component({
  is: 'di-li',
  data: {
    text: 'Hello, World'
  },
  methods: {
    world: function() {
      console.log('world');
    }
  },
  connected: function() {
    console.log("di-li connectedCallback")
  }
})

oan.Component({
  is: 'di-li-di-li',
  data: {
    text: 'Hello, World'
  },
  connected: function() {
    console.log("di-li-di-li connectedCallback")
  }
})
