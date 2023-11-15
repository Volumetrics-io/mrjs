// UTILS
import './utils/extensions';

import { RAPIER } from './core/rapier';

// CORE
import './core/MRElement';
import './core/System';
import './core/MRApp';
import './core/entity';
import './entities/Model';
import './entities/Light';

// SYSTEMS
import './component-systems/RapierPhysicsSystem';
import './component-systems/LayoutSystem';

// GEOMETRY
import './geometry/UIPlane';

// UI
import './UI/Button';
import './UI/Panel';
import './entities/Surface';
import './entities/Volume';

// MEDIA
import './UI/media/Image';

// TEXT
import './UI/Text/Font';
import './UI/Text/Text';
import './UI/Text/TextField';
import './UI/Text/TextEditor';

// UI: LAYOUT
import './entities/layout/Container';
import './entities/layout/Row';
import './entities/layout/Column';

//   EXPORTS
export * as THREE from 'three';

// CORE
export { default as MRElement } from './core/MRElement';
export { default as System } from './core/System';
export { default as Entity } from './core/entity';

// GEOMETRY
export { default as UIPlane } from './geometry/UIPlane';
// UI
export { default as Panel } from './UI/Panel';

// For testing
export * from './utils/loadModel';
export * from './utils/loadModel.test';
