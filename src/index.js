// UTILS
import './utils/extensions.js'

// CORE
import './core/MRElement.js'
import './core/System.js'
import './core/MRApp.js'
import './core/entity.js'

// SYSTEMS
import './component-systems/RapierPhysicsSystem.js'
import './component-systems/LayoutSystem.js'

// GEOMETRY
import './geometry/UIPlane.js'

// UI
import './core/Panel.js'
import './entities/Surface.js'
import './entities/Volume.js'
import './UI/TextEditor.js'

// UI: LAYOUT
import './entities/layout/Container.js'
import './entities/layout/Row.js'
import './entities/layout/Column.js'

//   EXPORTS
export * as THREE from 'three'
export * as Ammo from 'three/examples/jsm/libs/ammo.wasm.js'

// CORE
export { default as MRElement } from './core/MRElement.js'
export { default as MRSystemElement } from './core/System.js'
export { default as Entity } from './core/entity.js'

// GEOMETRY
export { default as UIPlane } from './geometry/UIPlane.js'
// UI
export { default as Panel } from './core/Panel.js'
