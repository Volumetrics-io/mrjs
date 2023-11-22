class SkyBox extends Entity {

    constructor() {
        super();

        const textureLoader = setLoaderType(this.data.loaderType);
        const texture = textureLoader.load([this.data.texture);

        // todo - what counts as scene in this case? entity? but that's specific to an object in the scene
        scene.background = texture;
    }

    function setLoaderType(type) {
        switch this.data.type {
        case 'sphere':
            return new THREE.SphereTextureLoader();
        case 'cube':
            return new THREE.CubeTextureLoader();
        default:
            console.error('undefined type for skybox texture');
            return;
    }
}
customElements.define('mr-skybox', SkyBox);
