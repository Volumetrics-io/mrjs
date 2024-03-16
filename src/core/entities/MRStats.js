import { MRDivEntity } from '../MRDivEntity';

// TODO: JSDoc

export class MRStats extends MRDivEntity {
    constructor() {
        super();
        this.ignoreStencil = true;
        this.object3D.name = 'stats';

        // Three.js InteractiveGroup has a dependency with WebGLRenderer and Camera
        // instances but they can't be accessed from here so these objects are initialized
        // in StatsSystem instead.
        this.stats = null;
        this.interactiveGroup = null;
        this.statsMesh = null;
    }
}

customElements.get('mr-stats') || customElements.define('mr-stats', MRStats);
