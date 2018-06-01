oan.Component({
  is: "di-da",
  data: {
    text: 'di-da text'
  },
  connected: function () {
    console.log("di connected")
  },
});

oan.Component({
  is: "di-li",
  data: {
    text: "Hello, ",
    text2: "World"
  },
  methods: {
    world: function () {
      console.log("world");
    }
  },
  connected: function () {
    this.text = 'Hello...';

    console.log(oan)
  },
});
