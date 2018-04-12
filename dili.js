let appConfig = {};
const components = [];

function createClass(component) {
  var klass, komponent;
  klass = class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      component.connected()
    }
  };

  return klass
}

class DiliComponent {
  constructor(component, element) {
    this.init(component, element);
    return this;
  }

  init(component, element) {
    customElements.define(`${component.is}`, createClass(component));
  }
}

function Component(component, element) {
  let diliComponent = new DiliComponent(component, element);
  components.push({
    is: name,
    component: diliComponent
  });
}

function App(config) {
  appConfig = config;
}
