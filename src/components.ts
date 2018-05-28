function bindModelToDom(dom: any, list: any, data: any) {
  Array.apply(null, dom.attributes).forEach(function(attr: any, index: any) {
    let attrName = attr.name
    Object.defineProperty(data, attrName, {
      get: function() {
        return dom[attrName]
      },
      set: function(newValue) {
        dom[attrName] = newValue
        dom.setAttribute(attrName, newValue)

        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          item[attrName] = newValue
          item.setAttribute(attrName, newValue)
        }
      },
      configurable: true
    })
  })

  return data
}

function twoWayBinding(list: any, obj: any) {
  let target = Object.assign({}, obj)

  for (let i = 0; i < list.length; i++) {
    obj = bindModelToDom(list[i], list, obj)
  }

  for (let property in target) {
    if (target.hasOwnProperty(property)) {
      obj[property] = target[property]
    }
  }

  function handleNewElement(element: any) {
    // console.log(element)
  }

  document.addEventListener('DOMNodeInserted', handleNewElement, false)
}

export class DiliComponent {
  constructor(component: any) {
    this.init(component)
    return this
  }

  init(component: any) {
    function DiliElement() {
      return Reflect.construct(HTMLElement, [], DiliElement)
    }

    DiliElement.prototype = Object.create(HTMLElement.prototype, {
      constructor: {
        value: function constructor() {
          console.log(this.component)
          return DiliElement
        }
      },

      getTemplateKey: {
        value: function getTemplateKey(str: any) {
          return str.match(/{{\s*[\w\.]+\s*}}/g).map((x: any) => x.match(/[\w\.]+/)[0])
        }
      },
      renderText: {
        value: function renderText(content: any, templateKeys: any, data: any) {
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
      },
      connectedCallback: {
        value: function connectedCallback(): void {
          this.component = component
          this.data = Object.assign({}, component.data)
          // if (this.attributes.length > 0) {
          //   console.log(this.getAttribute(this.attributes[0].name));
          // }
          // let templateKeys = this.getTemplateKey(this.textContent);
          // this.textContent = this.renderText(this.textContent, templateKeys, this.data);

          twoWayBinding([this], this.data)
          this.component.connected()
        }
      },
      attributeChangedCallback: {
        value: function attributeChangedCallback() {
          console.log('attributeChangedCallback')
        }
      },

      disconnectedCallback: {
        value: function disconnectedCallback() {
          console.log('disconnectedCallback')
        }
      },

      adoptedCallback: {
        value: function adoptedCallback() {
          console.log('adoptedCallback')
        }
      }
    })

    customElements.define(`${component.is}`, DiliElement)
  }
}
