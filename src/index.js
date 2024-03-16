/**
 * @module mrjs
 * @description The one-stop-shop module for mrjs (including an import for mrjsUtils). Includes the ability to access threejs directly as well.
 */

// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// Log the version number
import { version } from '../package.json';
console.log('Current ᴍʀjs Version:', version);

// STYLE
import './defaultStyle.css';

// GLOBAL
import './global';

// DATATYPES
import './dataTypes/MRClippingGeometry';
import './dataTypes/MRPlane';
// DATAMANAGERS
import './dataManagers/MRPlaneManager';

// CORE
import './core/MRApp';
import './core/MRDivEntity';
import './core/MRElement';
import './core/MREntity';
import './core/MRMedia';
import './core/MRSystem';
import './core/MRTextEntity';
// CORE - USER
import './core/user/MRHand';
import './core/user/MRUser';
// CORE - ENTITIES
import './core/entities/MRVolume.js';
import './core/entities/MRButton';
import './core/entities/MRHyperlink';
import './core/entities/MRImage';
import './core/entities/MRVideo';
import './core/entities/MRLight';
import './core/entities/MRModel';
import './core/entities/MRPanel';
import './core/entities/MRSkyBox';
import './core/entities/MRStats';
import './core/entities/MRTextArea';
import './core/entities/MRTextField';
// CORE - COMPONENT-SYSTEMS
import './core/componentSystems/AnchorSystem';
import './core/componentSystems/AnimationSystem';
import './core/componentSystems/ClippingSystem';
import './core/componentSystems/ControlSystem';
import './core/componentSystems/GeometryStyleSystem';
import './core/componentSystems/InstancingSystem';
import './core/componentSystems/LayoutSystem';
import './core/componentSystems/MaskingSystem';
import './core/componentSystems/MaterialStyleSystem';
import './core/componentSystems/PhysicsSystem';
import './core/componentSystems/SkyBoxSystem';
import './core/componentSystems/StatsSystem';
import './core/componentSystems/TextSystem';

// EXPORTS
// UTILS
export { mrjsUtils } from './utils/index.js';
// EXTRAS
export * from './extras/index.js';
// ADDITIONALS from mrjs
export * as THREE from 'three';
export * from 'mrjs/core/MRElement';
export * from 'mrjs/core/MRSystem';
export * from 'mrjs/core/MREntity';
export * from 'mrjs/dataTypes/MRClippingGeometry';
