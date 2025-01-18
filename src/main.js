// import { OrbitControls } from '../node_modules/three/addons/controls/OrbitControls.js';
import * as THREE from '../node_modules/three/build/three.module.js';
import { clickchecker } from './click_checker.js';
import {modelloader} from './loader.js';
import {lighting} from './lighting.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0xffffff);

modelloader(scene,'../assets/models/steampunk_underwater_explorer/scene.gltf');
modelloader(scene,'../assets/models/samsung/galaxyS10.gltf');

clickchecker(scene,camera);

lighting(scene);


function renderScene() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderScene);
