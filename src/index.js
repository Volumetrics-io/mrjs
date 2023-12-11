// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// CSS
import './styles.css';

// GLOBAL
import 'MRJS/global';

// UTILS
import 'MRJS/Utils/Display';
import 'MRJS/Utils/Geometry';
import 'MRJS/Utils/LoadMaterial';
import 'MRJS/Utils/LoadModel';
import 'MRJS/Utils/Math';
import 'MRJS/Utils/Math3D';
import 'MRJS/Utils/Physics';
import 'MRJS/Utils/String';

// DATATYPES
import 'MRJS/Datatypes/Hand';
import 'MRJS/Datatypes/ClippingGeometry';

// CORE
import 'MRJS/Core/MRApp';
import 'MRJS/Core/MRElement';
import 'MRJS/Core/MREntity';
import 'MRJS/Core/MRLayoutEntity';
import 'MRJS/Core/MRSystem';
import 'MRJS/Core/MRTextEntity';
import 'MRJS/Core/MRUIEntity';
// CORE - ENTITIES
import 'MRJS/Core/Entities/Button';
import 'MRJS/Core/Entities/Column';
import 'MRJS/Core/Entities/Container';
import 'MRJS/Core/Entities/Image';
import 'MRJS/Core/Entities/Light';
import 'MRJS/Core/Entities/Model';
import 'MRJS/Core/Entities/Row';
import 'MRJS/Core/Entities/SkyBox';
import 'MRJS/Core/Entities/Surface';
import 'MRJS/Core/Entities/TextArea';
import 'MRJS/Core/Entities/TextField';
import 'MRJS/Core/Entities/Volume';
// CORE - COMPONENT-SYSTEMS
import 'MRJS/Core/ComponentSystems/ClippingSystem';
import 'MRJS/Core/ComponentSystems/ControlSystem';
import 'MRJS/Core/ComponentSystems/InstancingSystem';
import 'MRJS/Core/ComponentSystems/LayoutSystem';
import 'MRJS/Core/ComponentSystems/PhysicsSystem';
import 'MRJS/Core/ComponentSystems/StyleSystem';
import 'MRJS/Core/ComponentSystems/SurfaceSystem';
import 'MRJS/Core/ComponentSystems/TextSystem';

// EXPORTS
export * as THREE from 'three';
export { MRElement } from 'MRJS/Core/MRElement';
export { MRSystem } from 'MRJS/Core/MRSystem';
export { MREntity } from 'MRJS/Core/MREntity';
export { UIPlane } from 'MRJS/Utils/Geometry';
