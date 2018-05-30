oan.DiliComponent({
  is: 'di-li',
  data: {
    text: 'Hello, ',
    text2: 'World'
  },
  methods: {
    world: function() {
      console.log('world');
    }
  },
  connected: function() {
    console.log("di-li connectedCallback")
  }
});
