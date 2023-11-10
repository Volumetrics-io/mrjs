import { AMFLoader }        from 'three/addons/loaders/AMFLoader.js';
import { BVHLoader }        from 'three/addons/loaders/BVHLoader.js';
import { ColladaLoader }    from 'three/addons/loaders/ColladaLoader.js';
import { DRACOLoader }      from 'three/addons/loaders/DRACOLoader.js';
import { FBXLoader }        from 'three/addons/loaders/FBXLoader.js';
import { GCodeLoader }      from 'three/addons/loaders/GCodeLoader.js';
import { GLTFLoader }       from 'three/addons/loaders/GLTFLoader.js';
// import { IFCLoader }        from 'web-ifc-three';
// import { IFCSPACE }         from 'web-ifc';
import { OBJLoader }        from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader }        from 'three/addons/loaders/MTLLoader.js';
import { Rhino3dmLoader }   from 'three/addons/loaders/3DMLoader.js';
import { PCDLoader }        from 'three/addons/loaders/PCDLoader.js';
import { PDBLoader }        from 'three/addons/loaders/PDBLoader.js';
import { PLYLoader }        from 'three/addons/loaders/PLYLoader.js';
import { STLLoader }        from 'three/addons/loaders/STLLoader.js';
import { SVGLoader }        from 'three/addons/loaders/SVGLoader.js';
import { TDSLoader }        from 'three/addons/loaders/TDSLoader.js';
import { ThreeMFLoader }    from 'three/addons/loaders/3MFLoader.js';
import { USDZLoader }       from 'three/addons/loaders/USDZLoader.js';

// TODOs before merge
// - look into smaller todos leftover
// - check if loading managers are required or optional for all or just some objects
// - see if any items after loading should be returned instead of directly added to scene
//   - prob should allow scene to be an optional parameter and return items as necessary
// - i should probably simply these to be more self contained of pure model and allow modifications on top, tbd
// - need to look at current stl loader setup and see if these match from an mr-js integration standpoint
// - current highest priority is GLB/GLTF and USDZ

/*
// Loads 3dm file and adds it to the scene
// @param libraryPath - optional - default is 'jsm/libs/rhino3dm'. If not using the
// default, set this variable to proper local path.
// Assumes cdn path is https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/
function load3DM(filePath, scene, libraryPath) {
    const loader = new Rhino3dmLoader();

    // cdn - generally, use this for the Library Path: https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/
    loader.setLibraryPath( 'jsm/libs/rhino3dm/' );
    loader.load( filePath, function ( object ) {
        scene.add( object );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads 3ds file and adds it to the scene
// @param resourcePath - path to the additional 3ds file resources
// @param normalMap - optional - 3ds files dont store normal maps, pass a THREE.TextureLoader
// as the normal map if you'd like to add one. Otherwise, leave variable empty.
function load3DS(filePath, resourcePath, scene, normalMap) {
    const loader = new TDSLoader();

    loader.setResourcePath(resourcePath);

    loader.load( filePath, function ( object ) {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material.specular.setScalar( 0.1 );
                if (normalMap != undefined) {
                    child.material.normalMap = normalMap;
                }
            }
        } );

        scene.add( object );

    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads 3mf file and adds it to the scene
// @param loadingManager - optional - User your own THREE.LoadingManager, otherwise defaults to
// simplest loading manager with empty constructor.
function load3MF(filePath, scene, loadingManager) {
    if (loadingManager == undefined) {
        loadingManager = new THREE.LoadingManager();
    }
    const loader = new ThreeMFLoader(loadingManager);

    // TODO - check back on this one - it seems *~ off ~*
    loader.load( filePath, function ( group ) {
        if ( object ) {

            object.traverse( function ( child ) {
                if ( child.material ) child.material.dispose();
                if ( child.material && child.material.map ) child.material.map.dispose();
                if ( child.geometry ) child.geometry.dispose();
            } );

            scene.remove( object );
        }

        object = group;

        scene.add(object);

    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads amf file and adds it to the scene
function loadAMF(filePath, scene) {
    const loader = new AMFLoader();

    loader.load( filePath, function ( amfobject ) {
        scene.add( amfobject );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads bvh file and adds it to the scene
function loadBVH(filePath, scene) {
    const loader = new BVHLoader();

    loader.load( filePath, function ( result ) {
        const skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );

        scene.add( result.skeleton.bones[ 0 ] );
        scene.add( skeletonHelper );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads Collada file and adds it to the scene
// @param loadingManager - optional - User your own THREE.LoadingManager, otherwise defaults to
// simplest loading manager with empty constructor.
function loadDAE(filePath, scene, loadingManager) {
    if (loadingManager == undefined) {
        loadingManager = new THREE.LoadingManager();
    }
    const loader = new ColladaLoader( loadingManager );

    // TODO - look into adding joints // kinematics setup sometimes used in this one
    // TODO - look into skinning version as well

    loader.load( filePath, function ( collada ) {
        scene.add(collada.scene);
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads Draco file and adds it to the scene
// @param decoderConfig - required - example: 'js'
// @param libraryPath - optional - default is 'jsm/libs/draco/'. If not using the
// default, set this variable to proper local path.
function loadDRACO(filePath, scene, decoderConfig, libraryPath) {
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderConfig( { type: 'js' } );
    dracoLoader.setDecoderPath( 'jsm/libs/draco/' );

    dracoLoader.load( filePath, function ( geometry ) {

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial();
        const mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

    }, undefined, function ( error ) {
        console.error( error );
        dracoLoader.dispose();
        return false;
    } );

    // Release decoder resources.
    dracoLoader.dispose();

    return true;
}

// Loads fbx file and adds it to the scene
function loadFBX(filePath, scene) {
    const loader = new FBXLoader();
    loader.load( filePath, function ( object ) {

        // TODO - add a way to load with nurbs

        scene.add( object );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads gcode file and adds it to the scene
function loadGCODE(filePath, scene) {
    const loader = new GCodeLoader();

    loader.load( filePath, function ( object ) {
        scene.add( object );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}
*/

// Loads GLTF/GLB file and adds it to the scene
function loadGLTF(filePath, scene) {
    const loader = new GLTFLoader();
    loader.load( filePath, function ( gltf ) {

        // TODO - look into what that avif and anisotropy versions of loading are
        // compressed, instancing, etc, etc

        scene.add( gltf.scene );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

/*
// Loads IFC file and adds it to the scene
function loadIFC(filePath, scene) {
    const ifcLoader = new IFCLoader();
    await ifcLoader.ifcManager.setWasmPath( 'https://unpkg.com/web-ifc@0.0.36/', true );

    await ifcLoader.ifcManager.parser.setupOptionalCategories( {
        [ IFCSPACE ]: false,
    } );

    await ifcLoader.ifcManager.applyWebIfcConfig( {
        USE_FAST_BOOLS: true
    } );

    ifcLoader.load( filePath, function ( model ) {
        scene.add( model.mesh );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// TODO - from imagebitmap <--> nrrd

// TODO - see if can combine the two below obj methods

// Loads OBJ file and adds it to the scene
function loadOBJ(filePath, scene) {
    const objLoader = new OBJLoader();
    objLoader.load(filePath, (root) => {
        scene.add(root);
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads OBJ file with material and adds it to the scene
function loadOBJWithMTL(objFilePath, mtlFilePath, scene) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load( mtlFilePath, function ( materials ) {
        materials.preload();

        objLoader
            .setMaterials( materials )
            .load( objFilePath, function ( object ) {

                scene.add( object );

            }, undefined, function ( error ) {
                console.error( error );
                return false;
            } );

    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// Loads pcd file and adds it to the scene
function loadPCD(filePath, scene) {
    const loader = new PCDLoader();

    loader.load( filePath, function ( points ) {
        scene.add( points );
    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// TODO - pdb

// Loads ply file and adds it to the scene
function loadPLY(filePath, scene) {
    const loader = new PLYLoader();
    loader.load( filePath, function ( geometry ) {

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial(  );
        const mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}
*/

// Loads stl file and adds it to the scene
function loadSTL(filePath, scene) {
    const loader = new STLLoader();

    loader.load( filePath, function ( geometry ) {

        const material = new THREE.MeshPhongMaterial( );
        const mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

    }, undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    return true;
}

// TODO - svg

// TODO - tilt, tff

// Loads USD/USDZ file and adds it to the scene
async function loadUSDZ(filePath, scene) {
    const usdzLoader = new USDZLoader();

    const [ model ] = await Promise.all( [
        usdzLoader.loadAsync( filePath ),
    ], undefined, function ( error ) {
        console.error( error );
        return false;
    } );
    
    scene.add( model );
    return true;
}

// TODO - vox <--> xyz

///////////////////////////
// Main Loading Function //
///////////////////////////

export function loadModel(filePath, extension, entityScene) {
    // later on - this would be better//faster with enums<->string<-->num interop but 
    // quick impl for now 
    if (extension == 'stl') {
        return loadSTL(filePath, entityScene);
    } else if (extension == 'gltf') {
        return loadGLTF(filePath, entityScene);
    } else if (extension == 'glb') {
        return loadGLTF(filePath, entityScene);
    } else if (extension == 'usd') {
        return loadUSDZ(filePath, entityScene);
    } else if (extension == 'usdz') {
        return loadUSDZ(filePath, entityScene);
    } else {
        console.log('ERR: the extensions ' + extension + ' is not supported by MR.js');
        return false;
    }
}
