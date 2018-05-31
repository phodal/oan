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

        let templateKeys = this.getTemplateKey(this.textContent)
        Observe(this.data, this)

        this.childNodes.forEach((node: any) => {
          node.textContent = this.renderText(node.textContent, templateKeys, this.data)

          let reg = /\{\{(.*)\}\}/
          let watcher = new Watcher(this, node, 'text2', 'input')

          if (node.nodeType === 3) {
            if (reg.test(node.nodeValue)) {
              let name = RegExp.$1 // 获取匹配到的字符串
              name = name.trim()
              let watcher = new Watcher(this, node, name, 'text')
            }
          }
        })

        setTimeout(() => {
          this.data.text = 'Hello...'
          console.log(this.data)
        }, 50)

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
