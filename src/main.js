import { OrbitControls } from '../node_modules/three/addons/controls/OrbitControls.js';
import {modelloader} from './loader.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0xffffff);

modelloader.load('../assets/models/steampunk_underwater_explorer/scene.gltf')
  .then((model)=>{
    scene.add(model);
  })
  .catch((error)=>{
    console.log('error:',error);
  });

modelloader.load('../assets/models/samsung/galaxyS10.gltf')
.then((model)=>{
  scene.add(model);
})
.catch((error)=>{
  console.log('error',error)
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log(`Mouse coordinates: (${mouse.x}, ${mouse.y})`);
});

document.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    if (clickedObject.name === 'button') {
      console.log('Clicked on button!');
    } else {
      console.log('Clicked object:', clickedObject.name);
    }
  } else {
    console.log('No intersections detected');
  }
});


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

function renderScene() {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderScene);
