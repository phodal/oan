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

        if (typeof this.component.ready === 'function') {
          this.component.ready()
        }
        return DiliElement
      }
    },
    createBinding: {
      value: function createBinding(childNodes: any) {
        childNodes.forEach((node: any) => {
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
              let name = RegExp.$1
              name = name.trim()
              let watcher = new Watcher(that.component, node, name, 'text')
            }
          }

          if (nodeName === 'p') {
            if (reg.test(node.innerHTML)) {
              let name = RegExp.$1
              name = name.trim()
              let watcher = new Watcher(that.component, node, name, 'p')
            }
          }
        })
      }
    },
    bindData: {
      value: function() {
        let data = this.component.data
        if (data) {
          Observe(data, this.component)
        }

        const thatDoc = document
        const thisDoc = ((thatDoc as any)._currentScript || thatDoc.currentScript).ownerDocument

        let bindShadowDom = false
        if (bindShadowDom) {
          const selector = thisDoc.querySelector('template')
          this.template = selector.content
          const shadowRoot = this.createShadowRoot()
          const clone = document.importNode(this.template, true)

          shadowRoot.appendChild(clone)
          this.createBinding(shadowRoot.childNodes)
        }

        let querySelector = thisDoc.querySelector('template')
        if (querySelector) {
          this.createBinding(querySelector.content.childNodes)
          this.appendChild(querySelector.content)
        }
      }
    },
    getAttrData: {
      value: function getAttrData() {
        let attrToRemove = []
        if (this.attributes && this.attributes.length > 0) {
          for (let i = 0; i < this.attributes.length; i++) {
            let attribute = this.attributes[i]
            if (/\[(\w+)\]/.test(attribute.name)) {
              let name = RegExp.$1
              this.component.data[name] = attribute.value
              attrToRemove.push(attribute.name)
            }
          }

          for (let remove of attrToRemove) {
            this.removeAttribute(remove)
          }
        }
      }
    },
    getBindEvents: {
      value: function getAttrData() {
        let eventMap: {}[] = []
        if (this.attributes && this.attributes.length > 0) {
          for (let i = 0; i < this.attributes.length; i++) {
            let attribute = this.attributes[i]
            if (/\((\w+)\)/.test(attribute.name)) {
              let name = RegExp.$1
              eventMap.push({
                event: name,
                method: attribute.value.replace(/\(\)/, '')
              })
            }
          }
        }

        return eventMap
      }
    },
    connectedCallback: {
      value: function connectedCallback(): void {
        let eventMap = this.getBindEvents()

        this.addEvents(this, eventMap)
        this.getAttrData()
        this.bindData()

        if (this.component.connected) {
          this.component.connected()
        }
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
    },

    addEvents: {
      value: function(node: Node, eventMap: any[]): void {
        for (let i = 0; i < eventMap.length; i++) {
          let event = eventMap[i]
          this.addEvent(node, event)
        }
      }
    },
    addEvent: {
      value: function(node: Node, event: any): void {
        node.addEventListener(event.event, this.component.methods[event.method])
      }
    },
    fireEvent: {
      value: function(): void {
        return
      }
    },
    removeEvent: {
      value: function(): void {
        return
      }
    },
    removeEvents: {
      value: function(): void {
        return
      }
    }
  })

  return customElements.define(`${component.is}`, DiliElement)
}
