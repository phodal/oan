let appConfig = {};
const components = [];

function createClass(component) {
  var klass;
  klass = class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      component.connected()
    }

    attributeChangedCallback() {

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
