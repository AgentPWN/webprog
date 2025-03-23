import * as THREE from '/node_modules/three/build/three.module.js';
// import { clickchecker } from './click_checker.js';
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
// import {modelloader} from './loader.js';
import {lighting} from './lighting.js';
// let buildings = ['BurgerBuilding','Cinema','PizzaBoard','PizzaBuilding','ShopBuilding'];
let added = [];
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const mouse = new THREE.Vector2();
const renderer = new THREE.WebGLRenderer({ antialias: true });
scene.background = new THREE.Color(0xffffff);
let city = new THREE.Group();
let isDragging = false;
let startMousePosition,currentMousePosition,deltax,deltay = 0;
camera.position.set(30, 30, 40);
camera.lookAt(0, 0, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
let names = ["fire_station", "hospital", "hotel", "pizzeria", "bakery", "market", "coffe_shop", "green_house", "yellow_house", "cinema"];
let chal = 0;
let dialog_open = false;
// let city = 0;
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
    let url = `/src/models/buildings/noncyberpunk/${element}`;
    const loader = new GLTFLoader();
    loader.load(url, (gltf)=>{
        city = gltf.scene; 
        city.traverse((child)=>{
          if (child.parent){
            child = child.parent;
          }
            const model = child;
            model.userData.id = id;
            model.userData.name = element;
            model.userData.solved = 0;
            scene.add(model);
        });

  });
});

    });
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

let  movementSpeed = 2;
document.addEventListener('mousedown', (event) =>{
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // isDragging = true;
  startMousePosition = { x : event.clientX , y : event.clientY };
})

// document.addEventListener('mousemove', (event) => {   
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   if (isDragging){
//     currentMousePosition = { x:event.clientX , y:event.clientY};
//     deltax = currentMousePosition.x - startMousePosition.x;
//     deltay = currentMousePosition.y - startMousePosition.y;

//     camera.position.x += (deltax)*0.01;
//     camera.position.z += (deltay)*0.03;
//   }
// });
let radius = camera.position.length();
let angle = 1;
let clicked = true;
document.addEventListener('keydown',(event)=>{
  if (dialog_open == false){
  if (clicked==true){
    radius = camera.position.length();
    clicked = false;
  }
  // console.log(event.key);
  if (event.key == "w") camera.position.z -= movementSpeed;
  if (event.key == "s") camera.position.z += movementSpeed;
  if (event.key == "a") camera.position.x -= movementSpeed;
  if (event.key == "d") camera.position.x += movementSpeed;
//   if (event.key == "q") {
//     camera.position.x = radius * Math.cos(angle);
//     camera.position.z = radius * Math.sin(angle);
//     angle += 0.05; // Speed of rotation
//     camera.lookAt(0, 0, 0);
//   }
//   if (event.key == "e") {
//     // radius = camera.position.length();
//     camera.position.x = radius * Math.cos(angle);
//     camera.position.z = radius * Math.sin(angle);
//     angle -= 0.05; // Speed of rotation
//     camera.lookAt(0, 0, 0);
//   }
  }
  
});
document.addEventListener('keyup',(event)=>{
  clicked = true;
});
// document.addEventListener('mouseup', (event)=>{
//   if (isDragging){
//     isDragging = false;
//   }
// });

document.addEventListener("click", () => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const dialog = document.getElementById("chal_desc"); 
  if (intersects.length !== 0) {
    let clickedObject = intersects[0].object;
    chal = intersects[0].object.parent;
    // console.log(clickedObject.name);
    // console.log(chal.name);
    while (clickedObject.parent && clickedObject.parent.name != "Scene") {
      // console.log(clickedObject.name);
      clickedObject = clickedObject.parent;

    }
      console.log(clickedObject.name);

    // console.log(intersects);
    console.log("Clicked Object Solved Status:", clickedObject.userData.solved);
    if (clickedObject.userData.solved !== 1) {

  if (names.includes(clickedObject.name)){
      const challengeId = clickedObject.name;

      fetch(`http://localhost:3001/api/${challengeId}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("Challenge Data:", data);

          if (data.desc) {
            dialog.innerHTML = `
              <p>${data.desc}<br>Challenge link: ${data.link}</p>
              <label for="${challengeId}">Enter flag</label>
              <input id="${challengeId}" name="flag">
              <button onclick="submitFlag('${challengeId}')" id="closeDialog">Enter</button>
            `;
            dialog_open = true;
          } else {
            dialog.innerHTML = `
              <p>This challenge is a work in progress, please give us some time.</p>
              <button id="closeDialog">Close</button>
            `;
            dialog_open = true;
          }

          dialog.showModal();
          const closebutton = document.getElementById("closeDialog");
          if (closebutton) {
            closebutton.addEventListener("click", function(event) {
              event.stopPropagation();
              dialog.close();
              dialog_open = false;
            });
          }
        
        });
    }} else {
      // console.log("Challenge already solved!");
      dialog.innerHTML = `
        <p>You have already solved this!</p>
        <button id="closeDialog">Close</button>
      `;
      dialog.showModal();
      const closebutton = document.getElementById("closeDialog");
          if (closebutton) {
            closebutton.addEventListener("click", () => {
              dialog.close();
              dialog_open = false;
            });
          }
    }}
  
  
});

export async function flagchecker(id, flag) {
  // console.log("trying to change the model");

  try {
    let response = await fetch("http://localhost:3001/api/checkflag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, flag }),  // Fix: Properly structure the request body
    });

    let data = await response.json();
    if (data.message != "error") {
      // console.log("Success:", data.message, data.id, data.flag);
      const position = chal.position.clone();
      const name = chal.userData.name;
      const id = chal.userData.id;
      const target = city.getObjectByName(chal.name);
      if (target) {
        target.removeFromParent();
        scene.remove(target);
      }
      
      let url = `/src/models/buildings/cyberpunk/bakery.glb`;
      const loader = new GLTFLoader();
      loader.load(url, function (gltf) {
        const model = gltf.scene;
        model.traverse((child)=>{
          // console.log(child.name);
          // while (child.parent) {
          //  child = child.parent;
          // }
          if (child.parent){
            child = child.parent;
          }
            // const model = child;
            if (child.name===chal.name){
              console.log(child.name);
              console.log(chal.name);
              child.userData.solved = 1;
              child.userData.id = id;
              child.position.copy(position);
              scene.add(child);
            }
            //model.scale.set(scaleFactorx, scaleFactory, scaleFactorz);
            
          
        
        });


        // scene.add(model);
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
