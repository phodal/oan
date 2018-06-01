import App from './app'
import { DiliComponent } from './components'
import { IComponent } from './shared/IComponent'

const components: IComponent[] = []

function Component(component: IComponent) {
  let diliComponent = DiliComponent(component)
  components.push({
    is: component.is,
    component: diliComponent
  })

  App.components = components
}

export { App, Component, DiliComponent }
