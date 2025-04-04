import * as THREE from '/node_modules/three/build/three.module.js';
export function lighting(scene){
const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(50, 50, 50);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 5);
scene.add(ambientLight);
}