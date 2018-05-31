import { Watcher } from './utils/Watcher'
import { Observe } from './utils/Observe'

export const DiliComponent = function(component: any) {
  function DiliElement() {
    let construct = Reflect.construct(HTMLElement, [], DiliElement)
    construct.constructor(component)
    return construct
  }

  DiliElement.prototype = Object.create(HTMLElement.prototype, {
    constructor: {
      value: function constructor() {
        this.component = component

        let data = this.component.data
        Observe(data, this.component)

        this.childNodes.forEach((node: any) => {
          let reg = /{{(.*)}}/
          let that = this
          let nodeName = node.nodeName.toLowerCase()

          if (nodeName === 'input') {
            if (node.attributes && node.attributes.length > 0) {
              let mapName
              for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i]
                if (attr.name === '[model]') {
                  let name = (mapName = attr.nodeValue)
                  node.addEventListener('input', function(e: any) {
                    that.component[name] = e.target.value
                  })

                  node.value = that.component.data[name]
                  node.removeAttribute('[model]')
                }
              }
              let watcher = new Watcher(that.component, node, mapName, 'input')
            }
          }

          if (node.nodeType === node.TEXT_NODE) {
            if (reg.test(node.nodeValue)) {
              let name = RegExp.$1 // 获取匹配到的字符串
              name = name.trim()
              let watcher = new Watcher(that.component, node, name, 'text')
            }
          }
        })

        return DiliElement
      }
    },
    connectedCallback: {
      value: function connectedCallback(): void {
        // this._childrenRead = false;
        // https://stackoverflow.com/questions/49786436/accessing-childnodes-of-custom-elments
        // const shadowRoot = this.attachShadow({mode: 'open'});
        // const template = document.createElement('template');
        // template.innerHTML = `Place your template here`;
        // const instance = template.content.cloneNode(true);
        // shadowRoot.appendChild(instance);

        console.log('connected')
        this.component.connected()
      }
    },
    attributeChangedCallback: {
      value: function attributeChangedCallback() {
        console.log('attributeChangedCallback')
        this.component.change()
      }
    },
    disconnectedCallback: {
      value: function disconnectedCallback() {
        console.log('disconnectedCallback')
        this.component.disconnected()
      }
    },
    adoptedCallback: {
      value: function adoptedCallback() {
        console.log('adoptedCallback')
        this.component.adopted()
      }
    }
  })

  return customElements.define(`${component.is}`, DiliElement)
}
