import * as THREE from '/node_modules/three/build/three.module.js';
import { clickchecker } from './click_checker.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
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
console.log(1)
try{lighting(scene);}
catch(error){
  console.error("lighting.js",error)
}
console.log(2)
let id = 0;
let x = 0;
let y = 0;
let z = 0;
fetch('http://localhost:3001/api/files')
.then(response=>response.json())
.then(data=>{
  data.files.forEach(element => {
    console.log(element);
    let url = `/src/models/buildings/${element}`;
    const loader = new GLTFLoader();
    console.log(url);
    loader.load(url, function(gltf){
        const model = gltf.scene.children[0];
        id +=1
        model.position.set(x,y,z);
        x += 10;
        // y += 1;
        // z += 10;
        model.userData.id = id;
        scene.add(model);
        const modelCount = gltf.scene.children.length;
  });
});




    // console.log(`Number of models in the pack: ${modelCount}`);

    // List all model names
    // gltf.scene.children.forEach((child, index) => {
        // console.log(`Model ${index + 1}: ${child.name || "Unnamed Model"}`);
    // });
    });
console.log(3)

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
//   console.log('this worked')
// );
// scene.add(cube);

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
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    let clickedObject = intersects[0].object;
    while (clickedObject.parent && !clickedObject.userData.id) {
      clickedObject = clickedObject.parent;
    }
    console.log(`${clickedObject.userData.id}`);
    fetch(`http://localhost:3001/api/${clickedObject.userData.id}`)
    .then(response => response.json())
    .then(data => {
      const dialog = document.getElementById("chal_desc");
      console.log(data);
      dialog.innerHTML = `
        <p>${data.desc}<br>Challenge link: ${data.link}</p>
        <button id="closeDialog">Close</button>
      `;
      // dialog.innerHTML = `
      // <p> this website is a work under progress, please give us some time, we will get back to you</p>
      // <button id="closeDialog">Close</button>
      // `;
      dialog.showModal();
      const closebutton = document.getElementById("closeDialog");
      closebutton.addEventListener("click", () => {
        dialog.close();
      });
    });
    
  }
});

// for (let i = 0; i < 1000; i++) {
//   const building = new THREE.Mesh(geometry, material);
//   building.name = 'button';
//   building.userData.id = "1"; 
//   building.position.set(Math.random() * 200 - 100, 0, Math.random() * 200 - 100);
//   building.scale.set(1, Math.random() * 10 + 1, 1);
//   city.add(building);
// }
// scene.add(city);

function renderScene() {
  renderer.render(scene, camera);

}
renderer.setAnimationLoop(renderScene);
