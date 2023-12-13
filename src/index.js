// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// GLOBAL
import './global';

// UTILS
import './Utils/Display';
import './Utils/Geometry';
import './Utils/LoadMaterial';
import './Utils/LoadModel';
import './Utils/Math';
import './Utils/Math3D';
import './Utils/Physics';
import './Utils/String';

// DATATYPES
import './Datatypes/Hand';
import './Datatypes/ClippingGeometry';

// CORE
import './Core/MRApp';
import './Core/MRElement';
import './Core/MREntity';
import './Core/MRSystem';
import './Core/MRTextEntity';
import './Core/MRUIEntity';
// CORE - ENTITIES
import './Core/Entities/Button';
import './Core/Entities/Image';
import './Core/Entities/Light';
import './Core/Entities/Model';
import './Core/Entities/SkyBox';
import './Core/Entities/Surface';
import './Core/Entities/TextArea';
import './Core/Entities/TextField';
import './Core/Entities/Volume';
// CORE - COMPONENT-SYSTEMS
import './Core/ComponentSystems/ClippingSystem';
import './Core/ComponentSystems/ControlSystem';
import './Core/ComponentSystems/InstancingSystem';
import './Core/ComponentSystems/PhysicsSystem';
import './Core/ComponentSystems/StyleSystem';
import './Core/ComponentSystems/SurfaceSystem';
import './Core/ComponentSystems/TextSystem';

// EXPORTS
export * as THREE from 'three';
export { MRElement } from './Core/MRElement';
export { MRSystem } from './Core/MRSystem';
export { MREntity } from './Core/MREntity';
export { UIPlane } from './Utils/Geometry';
