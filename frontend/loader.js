import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
export function modelloader(scene,url){
    const loader = new GLTFLoader();
    loader.load(url, function(gltf){
        scene.add(gltf.scene);
    },undefined, function(error){
        console.error(error)
    });
}
