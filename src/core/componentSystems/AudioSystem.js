import { MRSystem } from 'mrjs/core/MRSystem';

export class AudioSystem extends MRSystem {
    constructor(){
        super()

        this.audioLoader = new THREE.AudioLoader()

    }


    /**
     *
     * @param entity
     */
    attachedComponent(entity) {
        entity.sound = new THREE.PositionalAudio( this.app.listener );

        let comp = entity.components.get('audio')

        this.audioLoader.load(comp.src, (buffer) => {
            entity.sound.setBuffer(buffer)
            entity.sound.setRefDistance(comp.distance ?? 1)

            this.setAudioState(entity, comp.state)

            entity.sound.setLoop( comp.loop ?? false )
        })
    }

    /**
     *
     * @param entity
     */
    updatedComponent(entity) {
        let comp = entity.components.get('audio')
        entity.sound.setRefDistance(comp.distance ?? 1)
        this.setAudioState(entity, comp.state)
        entity.sound.setLoop( comp.loop ?? false )

    }

    /**
     *
     * @param entity
     */
    detachedComponent(entity) {
        entity.sound.stop()
        entity.sound.dispose()
        entity.sound = null
    }

    setAudioState(entity, state){
        switch (state) {
            case 'play':
                entity.sound.play()
                break;
            case 'pause':
                entity.sound.pause()
            case 'stop':
            default:
                entity.sound.stop()
                break;
        }
    }
}