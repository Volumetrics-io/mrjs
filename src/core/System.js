import { Entity } from './entity.js'

export class System {
  constructor() {
    this.environment = document.querySelector('mr-env')

    if(!this.environment) { return }
    // Need a way to register and deregister systems per environment
    this.registry = new Set()

    this.systemName = this.constructor.name.toLowerCase().split('system')[0]
    this.componentName = `comp-${this.systemName}`

    this.environment.registerSystem(this)

    this.environment.addEventListener(
      `${this.componentName}-attached`,
      this.onAttach
    )
    this.environment.addEventListener(
      `${this.componentName}-updated`,
      this.onUpdate
    )
    this.environment.addEventListener(
      `${this.componentName}-detached`,
      this.onDetatch
    )

    const entities = document.querySelectorAll(`[${this.componentName}]`)
    for (const entity of entities) {
      if (!(entity instanceof Entity)) {
        return
      }
      this.registry.add(entity)
    }
  }

  // Called per frame
  update() {
    console.log(`update ${this.systemName} System`)
  }

  // called when the component is initialized
  attachedComponent(entity) {
    console.log(
      `attached ${this.componentName} ${entity.getAttribute(
        this.componentName
      )}`
    )
  }

  updatedComponent(entity) {
    console.log(
      `updated ${this.componentName} ${entity.getAttribute(this.componentName)}`
    )
  }

  // called when the component is removed
  detachedComponent(entity) {
    console.log(`detached ${this.componentName}`)
  }

  onAttach = (event) => {
    this.registry.add(event.detail)
    this.attachedComponent(event.detail)
  }

  onUpdate = (event) => {
    this.updatedComponent(event.detail)
  }

  onDetatch = (event) => {
    this.registry.delete(event.detail)
    this.detachedComponent(event.detail)
  }

  disconnectedCallback() {
    this.environment.unregisterSystem(this)

    this.environment.removeEventListener(`${this.componentName}-attached`)
    this.environment.removeEventListener(`${this.componentName}-updated`)
    this.environment.removeEventListener(`${this.componentName}-detached`)
  }
}
