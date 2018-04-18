let appConfig = {};
const components = [];
// https://leihuang.me/posts/implementing-two-way-data-binding-with-vanilla-javascript/
const observable = value => {
  const listeners = [];
  const notify = newVal => listeners.forEach(listener => listener(newVal))
  function observer(newValue) {
    if (arguments.length && newValue !== value) {
      value = newValue;
      notify(newValue);
    }
    return value;
  }
  observer.subscribe = function(listener) { listeners.push(listener); };
  return observer;
}

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
