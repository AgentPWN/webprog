import * as THREE from '/node_modules/three/build/three.module.js';
import { clickchecker } from './click_checker.js';
// import {modelloader} from './loader.js';
import {lighting} from './lighting.js';
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const mouse = new THREE.Vector2();
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.background = new THREE.Color(0xffffff);
const city = new THREE.Group();
let isDragging = false;
let startMousePosition,currentMousePosition,deltax,deltay = 0;
// const gridHelper = new THREE.GridHelper(200, 50); 
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(100);
// scene.add(axesHelper);

camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

lighting(scene);

document.addEventListener('mousedown', (event) =>{
  isDragging = true;
  startMousePosition = { x : event.clientX , y : event.clientY };
  // console.log("starting:",startMousePosition);
})

document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (isDragging){
    currentMousePosition = { x:event.clientX , y:event.clientY};
    // console.log("dragging to:", currentMousePosition);
    deltax = currentMousePosition.x - startMousePosition.x;
    deltay = currentMousePosition.y - startMousePosition.y;

    camera.position.x += (deltax)*0.001;
    camera.position.z += (deltay)*0.003;
  }
});

document.addEventListener('mouseup', (event)=>{
  if (isDragging){
    isDragging = false;
  }
});

document.addEventListener('click', () => {
  if (clickchecker(scene,camera,mouse)){
    console.log('reached backend');
    fetch('/api/chal1')
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    });
  }
});

for (let i = 0; i < 1000; i++) {
  const building = new THREE.Mesh(geometry, material);
  building.name = 'button'
  building.position.set(Math.random() * 200 - 100, 0, Math.random() * 200 - 100);
  building.scale.set(1, Math.random() * 10 + 1, 1);
  city.add(building);
}
scene.add(city);

function renderScene() {
  renderer.render(scene, camera);

}
renderer.setAnimationLoop(renderScene);
