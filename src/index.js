// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// GLOBAL
import 'MRJS/global';

// UTILS
import 'MRJS/utils/geometry';
import 'MRJS/utils/loadMaterial';
import 'MRJS/utils/loadModel';
import 'MRJS/utils/math';
import 'MRJS/utils/physics';
import 'MRJS/utils/string';
import 'MRJS/utils/three';

// DATATYPES
import 'MRJS/datatypes/hand';

// CORE
import 'MRJS/core/mrApp';
import 'MRJS/core/mrElement';
import 'MRJS/core/mrEntity';
import 'MRJS/core/mrLayoutEntity';
import 'MRJS/core/mrSystem';
import 'MRJS/core/mrTextEntity';
import 'MRJS/core/mrUIEntity';
// CORE - COMPONENT_SYSTEMS
import 'MRJS/core/component-systems/clippingSystem';
import 'MRJS/core/component-systems/controlSystem';
import 'MRJS/core/component-systems/developerSystem';
import 'MRJS/core/component-systems/instancingSystem';
import 'MRJS/core/component-systems/layoutSystem';
import 'MRJS/core/component-systems/physicsSystem';
import 'MRJS/core/component-systems/styleSystem';
import 'MRJS/core/component-systems/surfaceSystem';
import 'MRJS/core/component-systems/textSystem';
// CORE - ENTITIES
import 'MRJS/core/entities/button';
import 'MRJS/core/entities/column';
import 'MRJS/core/entities/container';
import 'MRJS/core/entities/image';
import 'MRJS/core/entities/light';
import 'MRJS/core/entities/model';
import 'MRJS/core/entities/row';
import 'MRJS/core/entities/skyBox';
import 'MRJS/core/entities/surface';
import 'MRJS/core/entities/textArea';
import 'MRJS/core/entities/textField';
import 'MRJS/core/entities/volume';

//   EXPORTS
export * as THREE from 'three';

// CORE
export { MRElement } from './core/mrElement';
export { MRSystem } from './core/mrSystem';
export { MREntity } from './core/mrEntity';

// GEOMETRY
export { UIPlane } from 'MRJS/utils/geometry';
