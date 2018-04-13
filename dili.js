let appConfig = {};
const components = [];

function createClass(component) {
  var klass;
  klass = class extends HTMLElement {
    constructor() {
      super();
      console.log(this.attributes);
      console.log(this.getAttribute("hello"));
    }

    connectedCallback() {
      component.connected()
    }

    attributeChangedCallback(attr, oldVal, newVal) {
      console.log(attr)
    }

    disconnectedCallback() {

    }

    adoptedCallback() {

    }
  };

  return klass
}

class DiliComponent {
  constructor(component) {
    this.init(component);
    return this;
  }

  init(component) {
    customElements.define(`${component.is}`, createClass(component));
  }
}

function Component(component) {
  let diliComponent = new DiliComponent(component);
  components.push({
    is: name,
    component: diliComponent
  });
}

function App(config) {
  appConfig = config;
}
