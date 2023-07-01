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
  attachedComponent(entity, component) {
    console.log(
      `attached ${this.componentName} ${component}}`
    )
  }

  updatedComponent(entity, component) {
    console.log(
      `updated ${this.componentName} ${component}}`
    )
  }

  // called when the component is removed
  detachedComponent(entity) {
    console.log(`detached ${this.componentName}`)
  }

  onAttach = (event) => {
    this.registry.add(event.detail.entity)
    this.attachedComponent(event.detail.entity, event.detail.component)
  }

  onUpdate = (event) => {
    this.updatedComponent(event.detail.entity, event.detail.component)
  }

  onDetatch = (event) => {
    this.registry.delete(event.detail.entity)
    this.detachedComponent(event.detail.entity)
  }

  disconnectedCallback() {
    this.environment.unregisterSystem(this)

    this.environment.removeEventListener(`${this.componentName}-attached`)
    this.environment.removeEventListener(`${this.componentName}-updated`)
    this.environment.removeEventListener(`${this.componentName}-detached`)
  }
}
