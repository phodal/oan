import App from './app'
import { DiliComponent } from './components'
import { IComponent } from './shared/IComponent'

const components: IComponent[] = []

function Component(component: any) {
  let diliComponent = new DiliComponent(component)
  components.push({
    is: name,
    component: diliComponent
  })

  App.components = components
}

export { App, Component, DiliComponent }
