import Panel from './Panel.js'

export default class Button extends Panel {

  constructor() {
    super()


  }

  onHover = (event) => {
    switch (event.type) {
        case 'hover-start':
          panel.object3D.scale.addScalar(0.1)
          panel.object3D.position.z += 0.001

          break;

        case 'hover-end':
          panel.object3D.scale.subScalar(0.1)
          panel.object3D.position.z -= 0.001

          break;
      
        default:
          break;
      }
  }
}

customElements.get('mr-button') || customElements.define('mr-button', Button)
