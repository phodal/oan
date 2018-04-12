let appConfig = {};
const components = [];

class DiliElement extends HTMLElement {

}

class DiliComponent {
  constructor(component, element) {
    this.init(component, element);
    return this;
  }

  init(component, element) {
    class TempDom extends DiliElement {
      connectedCallback() {
        console.log('connectedCallback')
      }
    }
    customElements.define(`${component.is}`, TempDom);
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
