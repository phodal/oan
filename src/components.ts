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
        this.data = Object.assign({}, component.data)
        let data = this.data

        Observe(data, this)

        this.childNodes.forEach((node: any) => {
          let reg = /{{(.*)}}/
          let that = this
          if (node.tagName === 'INPUT') {
            if (node.attributes && node.attributes.length > 0) {
              let mapName
              for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i]
                if (attr.name === '[model]') {
                  let name = (mapName = attr.nodeValue)
                  node.addEventListener('input', function(e: any) {
                    that.data[name] = e.target.value
                  })

                  node.value = that.data[name]
                  node.removeAttribute('[model]')
                }
              }
              console.log(this, node, mapName)
              let watcher = new Watcher(this, node, mapName, 'input')
            }
          }

          if (node.nodeType === node.TEXT_NODE) {
            if (reg.test(node.nodeValue)) {
              let name = RegExp.$1 // 获取匹配到的字符串
              name = name.trim()
              console.log(name, this, node, name)
              let watcher = new Watcher(this, node, name, 'text')
            }
          }
        })

        setTimeout(() => {
          this.data.text = 'Hello...'
        }, 50)

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

  return customElements.define(`${component.is}`, DiliElement)
}
