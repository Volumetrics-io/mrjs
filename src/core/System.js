import Entity from './entity.js';

/**
 *
 */
export default class System {
  frameRate = null;

  delta = 0;

  /**
   *
   * @param useComponents
   * @param frameRate
   */
  constructor(useComponents = true, frameRate = null) {
    this.app = document.querySelector('mr-app');

    if (!this.app) {
      return;
    }

    this.frameRate = frameRate;
    // Need a way to register and deregister systems per environment
    this.registry = new Set();

    this.systemName = this.constructor.name.toLowerCase().split('system')[0];
    this.componentName = `comp-${this.systemName}`;

    this.app.registerSystem(this);

    if (useComponents) {
      document.addEventListener(`${this.componentName}-attached`, this.onAttach);
      document.addEventListener(`${this.componentName}-updated`, this.onUpdate);
      document.addEventListener(`${this.componentName}-detached`, this.onDetatch);
    }

    this.app.addEventListener('new-entity', (event) => {
      if (this.registry.has(event.target)) {
        return;
      }
      this.onNewEntity(event.target);
    });

    const entities = document.querySelectorAll(`[${this.componentName}]`);
    for (const entity of entities) {
      if (!(entity instanceof Entity)) {
        return;
      }
      this.registry.add(entity);
    }
  }

  /**
   *
   * @param deltaTime
   * @param frame
   */
  __update(deltaTime, frame) {
    if (this.frameRate) {
      this.delta += deltaTime;
      if (this.delta < this.frameRate) {
        return;
      }
    }
    this.update(deltaTime, frame);
    this.delta = 0;
  }

  // Called per frame
  /**
   *
   * @param deltaTime
   * @param frame
   */
  update(deltaTime, frame) {}

  // called when a new entity is added to the scene
  /**
   *
   * @param entity
   */
  onNewEntity(entity) {}

  // called when the component is initialized
  /**
   *
   * @param entity
   * @param data
   */
  attachedComponent(entity, data) {
    console.log(`attached ${this.componentName} ${data}}`);
  }

  /**
   *
   * @param entity
   * @param data
   */
  updatedComponent(entity, data) {
    console.log(`updated ${this.componentName} ${data}}`);
  }

  // called when the component is removed
  /**
   *
   * @param entity
   */
  detachedComponent(entity) {
    console.log(`detached ${this.componentName}`);
  }

  onAttach = (event) => {
    this.registry.add(event.detail.entity);
    const data = this.parseComponentString(event.detail.component);
    this.attachedComponent(event.detail.entity, data);
  };

  onUpdate = (event) => {
    const data = this.parseComponentString(event.detail.component);
    this.updatedComponent(event.detail.entity, data);
  };

  onDetatch = (event) => {
    this.registry.delete(event.detail.entity);
    this.detachedComponent(event.detail.entity);
  };

  // lol chatGPT made this.
  /**
   *
   * @param compString
   */
  parseComponentString(compString) {
    const regexPattern = /(\w+):\s*([^;]+)/g;
    const jsonObject = {};

    let match;
    while ((match = regexPattern.exec(compString)) !== null) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Check value type and convert if necessary
      if (value.includes(' ')) {
        value = value.split(' ').map((v) => parseFloat(v));
      } else if (/^\d+(\.\d+)?$/.test(value)) {
        value = parseFloat(value);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      jsonObject[key] = value;
    }

    return jsonObject;
  }
}
