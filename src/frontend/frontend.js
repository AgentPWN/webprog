import * as THREE from '/node_modules/three/build/three.module.js';
// import { clickchecker } from './click_checker.js';
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
camera.position.set(20, 15, 20);
camera.lookAt(0, 0, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

let chal = 0;
try{
  lighting(scene);
}
catch(error){
  console.error("lighting.js",error)
}

let id = 0;
let x = 0;
let y = 0;
let z = 0;
fetch('http://localhost:3001/api/files/noncyberpunk')
.then(response=>response.json())
.then(data=>{
  data.files.forEach(element => {
    //console.log(element);
    let url = `/src/models/buildings/noncyberpunk/${element}`;
    const loader = new GLTFLoader();
    //console.log(url);
    loader.load(url, function(gltf){
        const model = gltf.scene.children[0];
        id +=1
        model.position.set(x,y,z);
        x += 10;
        // y += 1;
        // z += 10;
        model.userData.id = id;
        model.userData.name = element;
        model.userData.solved = 0;
        scene.add(model);
        const modelCount = gltf.scene.children.length;
  });
});

    });

document.addEventListener('mousedown', (event) =>{
  isDragging = true;
  startMousePosition = { x : event.clientX , y : event.clientY };
})

document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (isDragging){
    currentMousePosition = { x:event.clientX , y:event.clientY};
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

document.addEventListener("click", () => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const dialog = document.getElementById("chal_desc"); // Ensure dialog is accessible

  if (intersects.length !== 0) {
    let clickedObject = intersects[0].object;
    chal = intersects[0].object.parent;

    while (clickedObject.parent && !clickedObject.userData.id) {
      clickedObject = clickedObject.parent;
    }

    console.log("Clicked Object Solved Status:", clickedObject.userData.solved);

    if (clickedObject.userData.solved !== 1) {
      const challengeId = clickedObject.userData.id;

      fetch(`http://localhost:3001/api/${challengeId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Challenge Data:", data);

          if (data.desc) {
            dialog.innerHTML = `
              <p>${data.desc}<br>Challenge link: ${data.link}</p>
              <label for="${challengeId}">Enter flag</label>
              <input id="${challengeId}" name="flag">
              <button onclick="submitFlag('${challengeId}')" id="closeDialog">Enter</button>
            `;
          } else {
            dialog.innerHTML = `
              <p>This challenge is a work in progress, please give us some time.</p>
              <button id="closeDialog">Close</button>
            `;
          }

          dialog.showModal();

          
        });
    } else {
      console.log("Challenge already solved!");
      dialog.innerHTML = `
        <p>You have already solved this!</p>
        <button id="closeDialog">Close</button>
      `;
      dialog.showModal();
      const closebutton = document.getElementById("closeDialog");
          if (closebutton) {
            closebutton.addEventListener("click", () => {
              dialog.close();
            });
          }
    }
  } else {
    console.log("Didn't click anything");
  }
});

export async function flagchecker(id, flag) {
  console.log("trying to change the model");

  try {
    let response = await fetch("http://localhost:3001/api/checkflag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, flag }),  // Fix: Properly structure the request body
    });

    let data = await response.json();
    if (data.message !== "error") {
      console.log("Success:", data.message, data.id, data.flag);
      const position = chal.position.clone();
      const name = chal.userData.name;
      const id = chal.userData.id;
      scene.remove(chal);
      let url = `/src/models/buildings/cyberpunk/${name}`;
      const loader = new GLTFLoader();
      loader.load(url, function (gltf) {
        const model = gltf.scene.children[0];
        model.userData.solved = 1;
        model.userData.id = id;
        model.position.copy(position);
        scene.add(model);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


function renderScene() {
  renderer.render(scene, camera);

}
renderer.setAnimationLoop(renderScene);
