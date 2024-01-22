import { MRSystem } from 'mrjs/core/MRSystem';

/**
 *
 */
export class AudioSystem extends MRSystem {
    /**
     *
     */
    constructor() {
        super();

        this.listener = new THREE.AudioListener();
        // this.listener.matrixAutoUpdate = false;
        this.app.scene.add(this.listener);

        this.audioLoader = new THREE.AudioLoader();
    }

    /**
     *
     * @param dt
     * @param frame
     */
    update(dt, frame) {
        this.listener.position.setFromMatrixPosition(this.app.userOrigin.matrixWorld);
        this.listener.setRotationFromMatrix(this.app.userOrigin.matrixWorld);
    }

    /**
     *
     * @param entity
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
     *
     * @param entity
     */
    updatedComponent(entity) {
        let comp = entity.components.get('audio');
        entity.sound.setRefDistance(comp.distance ?? 1);
        this.setAudioState(entity, comp.state);
        entity.sound.setLoop(comp.loop ?? false);
    }

    /**
     *
     * @param entity
     */
    detachedComponent(entity) {
        entity.sound.stop();
        entity.sound.dispose();
        entity.sound = null;
    }

    /**
     *
     * @param entity
     * @param state
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
