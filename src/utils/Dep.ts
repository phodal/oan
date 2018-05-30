export class Dep {
  static target: any
  private deps: any[]

  constructor() {
    this.deps = []
  }

  addDep(watcher: any) {
    if (watcher) {
      this.deps.push(watcher)
    }
  }

  notify() {
    this.deps.forEach(watcher => {
      watcher.update()
    })
  }
}
