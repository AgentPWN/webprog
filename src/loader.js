import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
export function modelloader(url){
    const loader = new THREE.GLTFLoader();
    return new Promise((resolve, reject)=>{
        loader.load(url,
            (gltf) => resolve(gltf.scene),
            undefined,
            (error) => reject(error)
        );
    });
}
