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
    console.log("di-li connectedCallback");
    console.log(this.data.text);
    setTimeout(() => {
      this.data.text = 'Hello...';
    }, 500);
  }
});
