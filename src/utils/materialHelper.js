import * as THREE from 'three';

// example MaterialString
// mat-phong
// "color: red; emissive: blue; specular: yellow; opacity: 0.5; shininess: 100; wireframe: true"

/**
 *
 */
export class MaterialHelper {
  /**
   *
   * @param object
   * @param materialType
   * @param parameterString
   */
  static applyMaterial(object, materialType, parameterString) {
    const parameters = MaterialHelper.parseParameterString(parameterString);
    const result = MaterialHelper.initMaterial(materialType.split('mat-')[1], parameters);
    if (result.opacity < 1) {
      result.transparent = true;
    }
    object.material = result;
  }

  /**
   *
   * @param object
   * @param textureType
   * @param parameterString
   */
  static applyTexture(object, textureType, parameterString) {
    const src = parameterString.split(':')[1].trim();
    const typeArray = textureType.split('-');
    const result = MaterialHelper.initTexture(typeArray[1], src);

    if (typeArray.length < 3) {
      object.material.map = result;
    } else {
      MaterialHelper.applyMap(object, typeArray[2], result);
    }
  }

  /**
   *
   * @param parameterString
   */
  static parseParameterString(parameterString) {
    let jsonString = parameterString.replaceAll(';', ',');
    jsonString = jsonString.spliceSplit(0, 0, '{');

    if (jsonString.slice(-1) == ',') {
      jsonString = jsonString.spliceSplit(-1, 1, '');
    }
    jsonString += '}';
    jsonString = jsonString
      .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":')
      .replace(/(['"])?([a-zA-Z]+)(['"])?/g, '"$2"')
      .replaceAll('"true"', 'true');

    console.log(jsonString);

    return JSON.parse(jsonString);
  }

  /**
   *
   * @param type
   * @param parameters
   */
  static initMaterial(type, parameters) {
    console.log(type);
    switch (type) {
      case 'basic':
        return new THREE.MeshBasicMaterial(parameters);
      case 'depth':
        return new THREE.MeshDepthMaterial(parameters);
      case 'distance':
        return new THREE.MeshDistanceMaterial(parameters);
      case 'lambert':
        return new THREE.MeshLambertMaterial(parameters);
      case 'line-basic':
        return new THREE.LineBasicMaterial(parameters);
      case 'line-dashed':
        return new THREE.LineDashedMaterial(parameters);
      case 'matcap':
        return new THREE.MeshMatcapMaterial(parameters);
      case 'normal':
        return new THREE.MeshNormalMaterial(parameters);
      case 'phong':
        return new THREE.MeshPhongMaterial(parameters);
      case 'physical':
        return new THREE.MeshPhysicalMaterial(parameters);
      case 'standard':
        return new THREE.MeshStandardMaterial(parameters);
      case 'toon':
        return new THREE.MeshToonMaterial(parameters);
      case 'points':
        return new THREE.PointsMaterial(parameters);
      case 'raw-shader':
        return new THREE.RawShaderMaterial(parameters);
      case 'shader':
        return new THREE.ShaderMaterial(parameters);
      case 'shadow':
        return new THREE.ShadowMaterial(parameters);
      case 'sprite':
        return new THREE.Sprite();
      default:
        return new THREE.MeshPhongMaterial(parameters);
    }
  }

  /**
   *
   * @param type
   * @param src
   */
  static initTexture(type, src) {
    switch (type) {
      case 'basic':
        return new THREE.TextureLoader().load(src);
      case 'canvas':
        return new THREE.CanvasTexture(src);
      case 'compressed':
        return new THREE.CompressedTextureLoader().load(src);
      case 'video':
        const videosrc = document.getElementById(src);
        return new THREE.VideoTexture(videosrc);
      default:
        return new THREE.TextureLoader().load(src);
    }
  }

  /**
   *
   * @param object
   * @param type
   * @param texture
   */
  static applyMap(object, type, texture) {
    switch (type) {
      case 'alpha':
        object.material.alphaMap = texture;
        break;
      case 'ao':
        object.material.aoMap = texture;
        break;
      case 'bump':
        object.material.bumpMap = texture;
        break;
      case 'displacement':
        object.material.displacementMap = texture;
        break;
      case 'emissive':
        object.material.emissiveMap = texture;
        break;
      case 'env':
        object.material.envMap = texture;
        break;
      case 'light':
        object.material.lightMap = texture;
        break;
      case 'metalness':
        object.material.metalnessMap = texture;
        break;
      case 'normal':
        object.material.normalMap = texture;
        break;
      case 'roughness':
        object.material.roughnessMap = texture;
        break;
      default:
        object.material.map = texture;
    }
  }
}
