// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// GLOBAL
import './global'

// UTILS
import './utils/geometry';
import './utils/loadMaterial';
import './utils/loadModel';
import './utils/math';
import './utils/physics';
import './utils/string';
import './utils/three';

// DATATYPES
import './datatypes/hand';

// CORE
import './core/mrApp';
import './core/mrElement';
import './core/mrEntity';
import './core/mrLayoutEntity';
import './core/mrSystem';
import './core/mrTextEntity';
import './core/mrUIEntity';
// CORE - COMPONENT_SYSTEMS
import './core/component-systems/clippingSystem';
import './core/component-systems/controlSystem';
import './core/component-systems/developerSystem';
import './core/component-systems/instancingSystem';
import './core/component-systems/layoutSystem';
import './core/component-systems/physicsSystem';
import './core/component-systems/styleSystem';
import './core/component-systems/surfaceSystem';
import './core/component-systems/textSystem';
// CORE - ENTITIES
import './core/entities/button';
import './core/entities/column';
import './core/entities/container';
import './core/entities/image';
import './core/entities/light';
import './core/entities/model';
import './core/entities/row';
import './core/entities/skyBox';
import './core/entities/surface';
import './core/entities/textArea';
import './core/entities/textField';
import './core/entities/volume';

//   EXPORTS
export * as THREE from 'three';

// CORE
export { default as MRElement } from './core/MRElement';
export { default as MRSystem } from './core/MRSystem';
export { default as MREntity } from './core/MREntity';

// GEOMETRY
export { default as UIPlane } from './geometry/UIPlane';
