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

          this.component = component
          this.data = Object.assign({}, component.data)
          if (this.attributes.length > 0) {
            console.log(this.getAttribute(this.attributes[0].name))
          }
          let templateKeys = this.getTemplateKey(this.textContent)
          this.textContent = this.renderText(this.textContent, templateKeys, this.data)

          console.log(this, this.childNodes)
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
