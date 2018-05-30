import { Dep } from './Dep'

let uid = 0

function replaceWith(scope: any, exp: any) {
  exp = exp.replace(/\s/g, '') // 去掉全部空格
  exp = ' ' + exp // 在开头加上一个空格
  let quickRegex = /([\s\+\-\*\/%&\|\^!~:\[\(<>=\?])([a-z_$][a-z_$0-9]*)/g

  exp = exp.replace(quickRegex, (a: any, b: any, c: any) => {
    return b + 'scope.' + c
  })
  let func = new Function('scope', 'return ' + exp)
  return func(scope)
}

export class Watcher {
  private readonly viewModel: any
  private id: number
  private readonly exp: any
  private readonly callback: any
  private oldValue: string

  constructor(viewModel: any, exp: any, callback: any) {
    this.viewModel = viewModel
    this.id = uid++
    this.exp = exp
    this.callback = callback
    this.oldValue = ''
    this.update()
    Dep.target = null
  }

  get() {
    Dep.target = this
    let res = this.compute(this.viewModel, this.exp)
    Dep.target = null
    return res
  }

  update() {
    let newValue = this.get()
    if (this.oldValue === newValue) {
      return
    }
    this.callback(newValue, this.oldValue)
    this.oldValue = newValue
  }

  compute(viewModel: any, exp: any) {
    let res = replaceWith(viewModel, exp)
    return res
  }
}
