class BaseElement extends HTMLElement {
  private component: any

  constructor(component: any) {
    super()

    this.component = component
    if (this.attributes.length > 0) {
      console.log(this.getAttribute(this.attributes[0].name))
    }
    let templateKeys = this.getTemplateKey(this.textContent)
    this.textContent = this.renderText(this.textContent, templateKeys, component.data)
  }

  renderText(content: any, templateKeys: any, data: any) {
    for (let i = 0; i < templateKeys.length; i++) {
      let key = templateKeys[i]
      if (data.hasOwnProperty(key)) {
        let searchValue = `{{${key}}}`
        content = content.replace(new RegExp(searchValue, 'g'), data[key])
      } else {
        if (/{{.*}}/.test(content)) {
          console.warn('template,', /{{.*}}/.exec(content), 'not found')
        }
        content = content.replace(/{{.*}}/, '')
      }
    }

    return content
  }

  getTemplateKey(str: any) {
    return str.match(/{{\s*[\w\.]+\s*}}/g).map((x: any) => x.match(/[\w\.]+/)[0])
  }

  connectedCallback() {
    this.component.connected()
  }

  attributeChangedCallback(attr: any, oldVal: any, newVal: any) {
    console.log(attr)
  }

  disconnectedCallback() {
    return
  }

  adoptedCallback() {
    return
  }
}

function createClass(component: any) {
  return new BaseElement(component)
}

export class DiliComponent {
  constructor(component: any) {
    this.init(component)
    return this
  }

  init(component: any) {
    customElements.define(`${component.is}`, createClass)
  }
}
