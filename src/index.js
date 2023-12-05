// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// GLOBAL
import 'MRJS/global';

// UTILS
import 'MRJS/utils/display';
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
// CORE - COMPONENT-SYSTEMS
import 'MRJS/core/component-systems/clippingSystem';
import 'MRJS/core/component-systems/controlSystem';
import 'MRJS/core/component-systems/developerSystem';
import 'MRJS/core/component-systems/instancingSystem';
import 'MRJS/core/component-systems/layoutSystem';
import 'MRJS/core/component-systems/physicsSystem';
import 'MRJS/core/component-systems/styleSystem';
import 'MRJS/core/component-systems/surfaceSystem';
import 'MRJS/core/component-systems/textSystem';

// EXPORTS
export * as THREE from 'three';
export { MRElement } from 'MRJS/core/mrElement';
export { MRSystem } from 'MRJS/core/mrSystem';
export { MREntity } from 'MRJS/core/mrEntity';
export { UIPlane } from 'MRJS/utils/geometry';
