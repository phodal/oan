export class Observer {
  private _data: any

  constructor(data: any) {
    this._data = data
    this.walk(this._data)
  }

  walk(data: any) {
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(vm: any, key: string, value: any) {
    let self = this
    if (value && typeof value === 'object') {
      this.walk(value)
    }
    Object.defineProperty(vm, key, {
      get: function() {
        return value
      },
      set: function(newVal) {
        if (value !== newVal) {
          if (newVal && typeof newVal === 'object') {
            self.walk(newVal)
          }
          value = newVal
        }
      }
    })
  }
}
