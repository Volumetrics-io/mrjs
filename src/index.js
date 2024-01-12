/**
 * @module mrjs
 * @description the overall one-stop-shop module for mrjs. Includes the ability to access threejs directly as well.
 */

// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// STYLE
import './defaultStyle.css';

// GLOBAL
import './global';

// DATATYPES
import './datatypes/ClippingGeometry';

// CORE
import './core/MRApp';
import './core/MRDivEntity';
import './core/MRElement';
import './core/MREntity';
import './core/MRHand';
import './core/MRSystem';
import './core/MRTextEntity';
import './core/entities/MRHyperlink.js';
// CORE - ENTITIES
import './core/entities/Button';
import './core/entities/Image';
import './core/entities/Light';
import './core/entities/Model';
import './core/entities/Panel';
import './core/entities/SkyBox';
import './core/entities/TextArea';
import './core/entities/TextField';
// CORE - COMPONENT-SYSTEMS
import './core/componentSystems/ClippingSystem';
import './core/componentSystems/ControlSystem';
import './core/componentSystems/InstancingSystem';
import './core/componentSystems/LayoutSystem';
import './core/componentSystems/PhysicsSystem';
import './core/componentSystems/StyleSystem';
import './core/componentSystems/TextSystem';

// UTILS
export { mrjsUtils } from './utils/index.js';

// EXPORTS
export * as THREE from 'three';
export * from './core/MRElement';
export * from './core/MRSystem';
export * from './core/MREntity';
