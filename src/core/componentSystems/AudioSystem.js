import { MRSystem } from 'mrjs/core/MRSystem';

/**
 * @class AudioSystem
 * @classdesc This system manages spatial audio in the THREE.js scene.
 * @augments MRSystem
 */
export class AudioSystem extends MRSystem {
    /**
     * @class
     * @description AudioSystem's Default constructor that sets up the audio listener and loader
     */
    constructor() {
        super();

        this.listener = new THREE.AudioListener();
        this.app.scene.add(this.listener);

        this.audioLoader = new THREE.AudioLoader();
    }

    /**
     * @function
     * @description The generic system update call. Updates the clipped view of every entity in this system's registry.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        this.listener.position.setFromMatrixPosition(this.app.user.origin.matrixWorld);
        this.listener.setRotationFromMatrix(this.app.user.origin.matrixWorld);
    }

    /**
     * @function
     * @description Called when the entity component is initialized
     * @param {object} entity - the entity being attached/initialized.
     */
    attachedComponent(entity) {
        entity.sound = new THREE.PositionalAudio(this.listener);

        entity.object3D.add(entity.sound);

        let comp = entity.components.get('audio');

        this.audioLoader.load(comp.src, (buffer) => {
            entity.sound.setBuffer(buffer);
            entity.sound.setRefDistance(comp.distance ?? 1);

            this.setAudioState(entity, comp.state);

            entity.sound.setLoop(comp.loop ?? false);
        });
    }

    /**
     * @function
     * @description Called when the entity component is updated
     * @param {object} entity - the entity being updated based on the component.
     */
    updatedComponent(entity) {
        let comp = entity.components.get('audio');
        entity.sound.setRefDistance(comp.distance ?? 1);
        this.setAudioState(entity, comp.state);
        entity.sound.setLoop(comp.loop ?? false);
    }

    /**
     * @function
     * @description Called when the entity component is detached
     * @param {object} entity - the entity being updated based on the component being detached.
     */
    detachedComponent(entity) {
        entity.sound.stop();
        entity.sound.dispose();
        entity.sound = null;
    }

    /**
     * @function
     * @description Updates the Audio State based on the user passed 'state' variable.
     * @param {object} entity - the entity being updated based on the component being detached.
     * @param {string} state - represents a parameter for the state of the sound 'play', 'pause', 'stop', etc
     */
    setAudioState(entity, state) {
        switch (state) {
            case 'play':
                if (entity.sound.isPlaying) {
                    entity.sound.stop();
                }
                entity.sound.play();
                break;
            case 'pause':
                entity.sound.pause();
            case 'stop':
            default:
                entity.sound.stop();
                break;
        }
    }
}
