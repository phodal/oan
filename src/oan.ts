import {App} from "./app";
import {DiliComponent} from "./components";

const components: any = [];

function Component(component: any) {
  let diliComponent = new DiliComponent(component);
  components.push({
    is: name,
    component: diliComponent
  });
}

export {
  App,
  Component,
  DiliComponent
};
