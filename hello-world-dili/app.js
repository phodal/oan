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
  connected: function() {
    console.log("connectedCallback")
  }
})

Component({
  is: 'di-li-di-li',
  connected: function() {
    console.log("connectedCallback")
  }
})
