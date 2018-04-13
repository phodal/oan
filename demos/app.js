// class MyDom extends DiliElement {
//   static get observedAttributes() {
//     console.log("observedAttributes");
//   }
//   connectedCallback() {
//     console.log("connectedCallback")
//   }
//   attributeChangedCallback(name, oldValue, newValue) {
//     console.log("attributeChangedCallback");
//   }
// }

Component({
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

Component({
  is: 'di-li-di-li',
  properties: 'hello',
  connected: function() {
    console.log("di-li-di-li connectedCallback")
  }
})
