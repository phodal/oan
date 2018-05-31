oan.Component({
  is: "di-li",
  data: {
    text: "Hello, ",
    text2: "World"
  },
  methods: {
    world: function() {
      console.log("world");
    }
  },
  connected: function() {
    this.data.text2 = 'Hello...';
  },
});
