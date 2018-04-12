class MyDom extends DiliElement {
  static get observedAttributes() {
    console.log("observedAttributes");
  }
  connectedCallback() {
    console.log("connectedCallback")
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("attributeChangedCallback");
  }
}

customElements.define('di-li', MyDom);
