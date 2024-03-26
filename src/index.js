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
import './core/MRElement';
import './core/MREntity';
import './core/MRSystem';
// CORE - USER
import './core/user/MRHand';
import './core/user/MRUser';
// CORE - ENTITIES
import './core/entities/MRButtonEntity';
import './core/entities/MRDivEntity';
import './core/entities/MRHyperlinkEntity';
import './core/entities/MRImageEntity';
import './core/entities/MRLightEntity';
import './core/entities/MRMediaEntity';
import './core/entities/MRModelEntity';
import './core/entities/MRPanelEntity';
import './core/entities/MRSkyBoxEntity';
import './core/entities/MRTextEntity';
import './core/entities/MRTextAreaEntity';
import './core/entities/MRTextFieldEntity';
import './core/entities/MRTextInputEntity';
import './core/entities/MRVideoEntity';
import './core/entities/MRVolumeEntity';
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
