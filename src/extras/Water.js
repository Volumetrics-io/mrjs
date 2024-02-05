import { Clock, Color, Matrix4, Mesh, RepeatWrapping, ShaderMaterial, TextureLoader, UniformsLib, UniformsUtils, Vector2, Vector4 } from 'three';
import { Refractor } from 'three/examples/jsm/objects/Refractor.js';
import { MRSystem } from '../core/MRSystem';

/**
 * References:
 *	https://alex.vlachos.com/graphics/Vlachos-SIGGRAPH10-WaterFlow.pdf
 *	http://graphicsrunner.blogspot.de/2010/08/water-using-flow-maps.html
 *
 */

class Water extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        this.isWater = true;

        this.type = 'Water';

        this.color = options.color !== undefined ? new Color(options.color) : new Color(0xffffff);
        this.textureWidth = options.textureWidth || 512;
        this.textureHeight = options.textureHeight || 512;
        this.clipBias = options.clipBias || 0;
        this.flowDirection = options.flowDirection || new Vector2(1, 0);
        this.flowSpeed = options.flowSpeed || 0.03;
        this.reflectivity = options.reflectivity || 0.02;
        this.shaderScale = options.scale || 1;
        this.shader = options.shader || this.WaterShader;

        this.textureLoader = new TextureLoader();

        this.flowMap = options.flowMap || undefined;
        this.normalMap0 = options.normalMap0 || textureLoader.load('textures/water/Water_1_M_Normal.jpg');
        this.normalMap1 = options.normalMap1 || textureLoader.load('textures/water/Water_2_M_Normal.jpg');

        this.cycle = 0.15; // a cycle of a flow map phase
        this.halfCycle = this.cycle * 0.5;
        this.textureMatrix = new Matrix4();
        this.fps = options.fps || 30;

        // internal components

        if (Refractor === undefined) {
            console.error('THREE.Water: Required component Refractor not found.');
            return;
        }

        this.refractor = new Refractor(geometry, {
            textureWidth: this.textureWidth,
            textureHeight: this.textureHeight,
            clipBias: this.clipBias,
        });

        this.refractor.matrixAutoUpdate = false;

        // material

        this.material = new ShaderMaterial({
            name: this.shader.name,
            uniforms: UniformsUtils.merge([UniformsLib['fog'], this.shader.uniforms]),
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            fog: true,
        });

        if (this.flowMap !== undefined) {
            this.material.defines.USE_FLOWMAP = '';
            this.material.uniforms['tFlowMap'] = {
                type: 't',
                value: this.flowMap,
            };
        } else {
            this.material.uniforms['flowDirection'] = {
                type: 'v2',
                value: this.flowDirection,
            };
        }

        // maps

        this.normalMap0.wrapS = this.normalMap0.wrapT = RepeatWrapping;
        this.normalMap1.wrapS = this.normalMap1.wrapT = RepeatWrapping;

        this.material.uniforms['tRefractionMap'].value = this.refractor.getRenderTarget().texture;
        this.material.uniforms['tNormalMap0'].value = this.normalMap0;
        this.material.uniforms['tNormalMap1'].value = this.normalMap1;

        // water

        this.material.uniforms['color'].value = this.color;
        this.material.uniforms['reflectivity'].value = this.reflectivity;
        this.material.uniforms['textureMatrix'].value = this.textureMatrix;

        // inital values

        this.material.uniforms['config'].value.x = 0; // flowMapOffset0
        this.material.uniforms['config'].value.y = this.halfCycle; // flowMapOffset1
        this.material.uniforms['config'].value.z = this.halfCycle; // halfCycle
        this.material.uniforms['config'].value.w = this.shaderScale; // scale

        this.ws = new WaterSystem(this);
    }

    // functions

    updateTextureMatrix(camera) {
        this.textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);

        this.textureMatrix.multiply(camera.projectionMatrix);
        this.textureMatrix.multiply(camera.matrixWorldInverse);
        this.textureMatrix.multiply(this.matrixWorld);
    }

    updateFlow(delta) {
        this.delta = delta;
        this.config = this.material.uniforms['config'];

        this.config.value.x += this.flowSpeed * this.delta; // flowMapOffset0
        this.config.value.y = this.config.value.x + this.halfCycle; // flowMapOffset1

        // Important: The distance between offsets should be always the value of "halfCycle".
        // Moreover, both offsets should be in the range of [ 0, cycle ].
        // This approach ensures a smooth water flow and avoids "reset" effects.

        if (this.config.value.x >= this.cycle) {
            this.config.value.x = 0;
            this.config.value.y = this.halfCycle;
        } else if (this.config.value.y >= this.cycle) {
            this.config.value.y = this.config.value.y - this.cycle;
        }
    }

    // shader
    WaterShader = {
        name: 'WaterShader',

        uniforms: {
            color: {
                type: 'c',
                value: null,
            },

            reflectivity: {
                type: 'f',
                value: 0,
            },

            tRefractionMap: {
                type: 't',
                value: null,
            },

            tNormalMap0: {
                type: 't',
                value: null,
            },

            tNormalMap1: {
                type: 't',
                value: null,
            },

            textureMatrix: {
                type: 'm4',
                value: null,
            },

            config: {
                type: 'v4',
                value: new Vector4(),
            },
        },

        vertexShader: /* glsl */ `
	
			#include <common>
			#include <fog_pars_vertex>
			#include <logdepthbuf_pars_vertex>
	
			uniform mat4 textureMatrix;
	
			varying vec4 vCoord;
			varying vec2 vUv;
			varying vec3 vToEye;
			#include <clipping_planes_pars_vertex>
	
	
			void main() {
	
				vUv = uv;
				vCoord = textureMatrix * vec4( position, 1.0 );
	
	
				#include <begin_vertex>
				#include <project_vertex>
				#include <worldpos_vertex>
				#include <clipping_planes_vertex>
	
				worldPosition = modelMatrix * vec4( position, 1.0 );
				vToEye = cameraPosition - worldPosition.xyz;
	
				mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
				gl_Position = projectionMatrix * mvPosition;
	
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
	
			}`,

        fragmentShader: /* glsl */ `
			#include <clipping_planes_pars_fragment>
	
	
			#include <common>
			#include <fog_pars_fragment>
			#include <logdepthbuf_pars_fragment>
	
			uniform sampler2D tRefractionMap;
			uniform sampler2D tNormalMap0;
			uniform sampler2D tNormalMap1;
	
			#ifdef USE_FLOWMAP
				uniform sampler2D tFlowMap;
			#else
				uniform vec2 flowDirection;
			#endif
	
			uniform vec3 color;
			uniform float reflectivity;
			uniform vec4 config;
	
			varying vec4 vCoord;
			varying vec2 vUv;
			varying vec3 vToEye;
	
			void main() {
				#include <clipping_planes_fragment>
	
	
				float flowMapOffset0 = config.x;
				float flowMapOffset1 = config.y;
				float halfCycle = config.z;
				float scale = config.w;
	
				vec3 toEye = normalize( vToEye );
	
				// determine flow direction
				vec2 flow;
				#ifdef USE_FLOWMAP
					flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
				#else
					flow = flowDirection;
				#endif
				flow.x *= - 1.0;
	
				// sample normal maps (distort uvs with flowdata)
				vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
				vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );
	
				// linear interpolate to get the final normal color
				float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
				vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );
	
				// calculate normal vector
				vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
	
				// calculate the fresnel term to blend reflection and refraction maps
				float theta = max( dot( toEye, normal ), 0.0 );
				float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );
	
				// calculate final uv coords
				vec3 coord = vCoord.xyz / vCoord.w;
				vec2 uv = coord.xy + coord.z * normal.xz * 0.05;
	
				vec4 refractColor = texture2D( tRefractionMap, uv );
	
				// Set the fragment color to the refraction color only, ignoring reflection
				gl_FragColor = vec4( color, 1.0 ) * refractColor;
	
				
				#include <tonemapping_fragment>
				#include <logdepthbuf_fragment>
				#include <fog_fragment>
	
			}`,
    };
}

class WaterSystem extends MRSystem {
    constructor(water) {
        super(false, 1 / water.fps);
        this.water = water;
    }

    update(dt, f) {
        if (this.water.visible) {
            this.water.updateTextureMatrix(this.app.user);
            this.water.updateFlow(dt);

            this.water.visible = false;

            this.water.refractor.matrixWorld.copy(this.water.matrixWorld);

            this.water.refractor.onBeforeRender(this.app.renderer, this.app.scene, this.app.user);

            this.water.visible = true;
        }
    }
}

export { Water };
