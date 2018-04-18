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
      const originContent = this.textContent;

      // var initial = observable();
      // this.textContent = component.data.text;
      // console.log(component)
      // let obs = observable(component.data.text);
      // obs.subscribe(function () {
      //   this.textContent = observable(component.data.text);
      // });

      if (this.attributes.length > 0) {
        console.log(this.getAttribute(this.attributes[0].name));
      }
      let templateKeys = this.getTemplateKey(this.textContent);
      console.log(templateKeys)
      this.textContent = this.renderText(this.textContent, templateKeys, component.data);
    }

    renderText(content, templateKeys, data) {
      for (let i = 0; i < templateKeys.length; i ++) {
        let key = templateKeys[0];
        if (data.hasOwnProperty(key)) {
          let searchValue = `{{${key}}}`;
          content = content.replace(new RegExp(searchValue, 'g'), data[key]);
        }
      }

      return content;
    }

    getTemplateKey(str) {
      return str.match(/{{\s*[\w\.]+\s*}}/g).map(function (x) {
        return x.match(/[\w\.]+/)[0];
      });
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
