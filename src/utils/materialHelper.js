import { json } from 'd3';
import * as THREE from 'three';

// example MaterialString
// mat-phong
// "color: red; emissive: blue; specular: yellow; opacity: 0.5; shininess: 100; wireframe: true"

export class MaterialHelper {
    static createMaterial(type, materialString) {
        let parameters = MaterialHelper.parseMaterialString(materialString)
        let result = MaterialHelper.initMaterial(type.split('mat-')[1], parameters)
        result.receiveShadow = true
        console.log(result);
        return result
    }

    static applyTexture(materialString) {

    }

    static parseMaterialString(materialString) {
        let jsonString = materialString.replaceAll(';', ',')
        jsonString = jsonString.spliceSplit(0, 0, '{')

        if (jsonString.slice(-1) == ',') {
            jsonString = jsonString.spliceSplit(-1, 1, '')
        }
        jsonString += '}'
        jsonString = jsonString.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2":')
                            .replace(/(['"])?([a-zA-Z]+)(['"])?/g, '"$2"')
                            .replaceAll('"true"', 'true')

        console.log(jsonString);

        return JSON.parse(jsonString)
    }

    static initMaterial(type, parameters){
        console.log(type);
        switch (type) {
            case 'basic':
                return new THREE.MeshBasicMaterial(parameters)
            case 'depth':
                return new THREE.MeshDepthMaterial(parameters)
            case 'distance':
                return new THREE.MeshDistanceMaterial(parameters)
            case 'lambert':
                return new THREE.MeshLambertMaterial(parameters)
            case 'line-basic':
                return new THREE.LineBasicMaterial(parameters)
            case 'line-dashed':
                return new THREE.LineDashedMaterial(parameters)
            case 'matcap':
                return new THREE.MeshMatcapMaterial(parameters)
            case 'normal':
                return new THREE.MeshNormalMaterial(parameters)
            case 'phong':
                return new THREE.MeshPhongMaterial(parameters)
            case 'physical':
                return new THREE.MeshPhysicalMaterial(parameters)
            case 'standard':
                return new THREE.MeshStandardMaterial(parameters)
            case 'toon':
                return new THREE.MeshToonMaterial(parameters)
            case 'points':
                return new THREE.PointsMaterial(parameters)
            case 'raw-shader':
                return new THREE.RawShaderMaterial(parameters)
            case 'shader':
                return new THREE.ShaderMaterial(parameters)
            case 'shadow':
                return new THREE.ShadowMaterial(parameters)
            case 'sprite':
                return new THREE.Sprite()
            default:
                return new THREE.MeshPhongMaterial(parameters)
        }
    }
}