/**
 * @module mrjs
 * @description The one-stop-shop module for mrjs (including an import for mrjsUtils). Includes the ability to access threejs directly as well.
 */

// TODO - this should auto grab instead of manually be updated as manual updates will create problems.
// for import and export

import * as THREE from 'three';

// Log the version number
import { version } from '../package.json';
console.log('-- ᴍʀjs Current Versioning --\nᴍʀjs :', version, '( using threejs :', THREE.REVISION, ')');

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
import './core/entities/MRStatsEntity';
import './core/entities/MRTextEntity';
import './core/entities/MRTextAreaEntity';
import './core/entities/MRTextFieldEntity';
import './core/entities/MRTextInputEntity';
import './core/entities/MRVideoEntity';
import './core/entities/MRVolumeEntity';
// CORE - COMPONENT-SYSTEMS
import './core/componentSystems/AnchorSystem';
import './core/componentSystems/AnimationSystem';
import './core/componentSystems/BoundaryVisibilitySystem';
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

// THREE - So users dont need a separate versioning import for it.
export * as THREE from 'three';

// MRJS - Exporting only necessary items for users to overwrite as they use MRjs.
export * from 'mrjs/core/MRSystem';
export * from 'mrjs/core/MREntity';
export * from 'mrjs/core/entities/MRButtonEntity';
export * from 'mrjs/core/entities/MRDivEntity';
export * from 'mrjs/core/entities/MRHyperlinkEntity';
export * from 'mrjs/core/entities/MRImageEntity';
export * from 'mrjs/core/entities/MRLightEntity';
export * from 'mrjs/core/entities/MRMediaEntity';
export * from 'mrjs/core/entities/MRModelEntity';
export * from 'mrjs/core/entities/MRPanelEntity';
export * from 'mrjs/core/entities/MRSkyBoxEntity';
export * from 'mrjs/core/entities/MRTextAreaEntity';
export * from 'mrjs/core/entities/MRTextEntity';
export * from 'mrjs/core/entities/MRTextFieldEntity';
export * from 'mrjs/core/entities/MRVideoEntity';
export * from 'mrjs/core/entities/MRVolumeEntity';

// EXTRAS
export * from './extras/index.js';

// UTILS - exporting as a named group since it's a submodule of this js module
export { mrjsUtils } from './utils/index.js';

console.log('MRJS fully loaded');
document.dispatchEvent(new Event('mrjsReady'));
