// TODO - this should auto grab instead of manually be updated as manual updates will create problems.

// UTILS
import './utils/extensions';

// CORE
import './core/MRElement';
import './core/System';
import './core/MRApp';
import './core/entity';
import './entities/Model';
import './entities/Light';

// SYSTEMS
import './component-systems/RapierPhysicsSystem';
import './component-systems/LayoutSystem';

// GEOMETRY
import './geometry/UIPlane';

// UI
import './UI/Button';
import './entities/Surface';
import './entities/Volume';

// MEDIA
import './UI/media/Image';

// TEXT
import './UI/Text/Text';
import './UI/Text/TextField';
import './UI/Text/TextArea';

// UI: LAYOUT
import './entities/layout/Container';
import './entities/layout/Row';
import './entities/layout/Column';

//   EXPORTS
export * as THREE from 'three';

// CORE
export { default as MRElement } from './core/MRElement';
export { default as System } from './core/System';
export { default as Entity } from './core/entity';

// GEOMETRY
export { default as UIPlane } from './geometry/UIPlane';
// UI
// export { default as Panel } from './UI/Panel';
