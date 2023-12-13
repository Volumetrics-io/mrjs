// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// STYLE
import './defaultStyle.css';

// GLOBAL
import './global';

// DATATYPES
import './datatypes/Hand';
import './datatypes/ClippingGeometry';

// CORE
import './core/MRApp';
import './core/MRDivEntity';
import './core/MRElement';
import './core/MREntity';
import './core/MRSystem';
import './core/MRTextEntity';
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
// CORE - COMPONENT-SYSTEMS
import './core/componentSystems/ClippingSystem';
import './core/componentSystems/ControlSystem';
import './core/componentSystems/InstancingSystem';
import './core/componentSystems/LayoutSystem';
import './core/componentSystems/PhysicsSystem';
import './core/componentSystems/StyleSystem';
import './core/componentSystems/SurfaceSystem';
import './core/componentSystems/TextSystem';

// UTILS
import './utils';

// EXPORTS
export * as THREE from 'three';
export { MRElement } from './core/MRElement';
export { MRSystem } from './core/MRSystem';
export { MREntity } from './core/MREntity';
export * from './utils';
