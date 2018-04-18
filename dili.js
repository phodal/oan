let appConfig = {};
const components = [];

const observable = value => {
  const listeners = [];
  const notify = newVal => listeners.forEach(listener => listener(newVal));

  function observer(newValue) {
    if (arguments.length && newValue !== value) {
      value = newValue;
      notify(newValue);
    }
    return value;
  }

  observer.subscribe = function (listener) {
    listeners.push(listener);
  };
  return observer;
};

function createClass(component) {
  var klass;
  klass = class extends HTMLElement {
    constructor() {
      super();
      // var initial = observable();
      this.textContent = component.data.text;
      // console.log(component)
      // let obs = observable(component.data.text);
      // obs.subscribe(function () {
      //   this.textContent = observable(component.data.text);
      // });

      console.log(this.children);
      console.log(this.textContent);
      console.log(this.attributes);
      console.log(this.getAttribute("(hello)"));
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
