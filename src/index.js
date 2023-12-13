// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// STYLE
import './defaultStyle.css';

// GLOBAL
import './global';

// UTILS
import './utils/Display';
import './utils/Geometry';
import './utils/LoadMaterial';
import './utils/LoadModel';
import './utils/Math';
import './utils/Math3D';
import './utils/Physics';
import './utils/String';

// DATATYPES
import './datatypes/Hand';
import './datatypes/ClippingGeometry';

// CORE
import './core/MRApp';
import './core/MRElement';
import './core/MREntity';
import './core/MRSystem';
import './core/MRTextEntity';
import './core/MRDivEntity';
// CORE - ENTITIES
import './core/entities/Button';
import './core/entities/Image';
import './core/entities/Light';
import './core/entities/Model';
import './core/entities/Panel';
import './core/entities/SkyBox';
import './core/entities/Surface';
import './core/entities/TextArea';
import './core/entities/TextField';
import './core/entities/Volume';
// CORE - COMPONENT-SYSTEMS
import './core/componentSystems/ClippingSystem';
import './core/componentSystems/ControlSystem';
import './core/componentSystems/InstancingSystem';
import './core/componentSystems/LayoutSystem';
import './core/componentSystems/PhysicsSystem';
import './core/componentSystems/StyleSystem';
import './core/componentSystems/SurfaceSystem';
import './core/componentSystems/TextSystem';

// EXPORTS
export * as THREE from 'three';
export { MRElement } from './core/MRElement';
export { MRSystem } from './core/MRSystem';
export { MREntity } from './core/MREntity';
export { UIPlane } from './utils/Geometry';
