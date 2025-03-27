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
// let city = new THREE.Group();
let city = 0;
let isDragging = false;
let startMousePosition,currentMousePosition,deltax,deltay = 0;
let right_edge = 0;
let left_edge = 0;
let width = 0;
let top_edge = 0;
let bottom_edge = 0;
let depth = 0;
camera.position.set(80, 50, -80);
camera.lookAt(60, 0, -105);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
let names = ["Building_Sky_big_color01",
             "Building_Sky_big_color01.001",
             "Building_Sky_small_color01", 
             "Building_Auto_Service", 
             "Building_Bakery",
             "Building_Bakery.001", 
             "Building_Books_Shop", 
             "Building_Bar", 
             "Building_Chicken_Shop", 
             "Building_Chicken_Shop.001", 
             "Building_Clothing",
             "Building_Coffee_Shop",
             "Building_Drug_Store",
             "Building_Drug_Store.001",
             "Building_Factory",
             "Building_Fast_Food",
             "Building_Fruits_Shop",
             "Building_Gas_Station",
             "Building_Gift_Shop",
             "Building_House_01_color01",
             "Building_House_02_color01",
             "Building_House_04_color01.001",
             "Building_Music_Store",
             "Building_Pizza",
             "Building_Residential_color01",
             "Building_Residential_color01.001",
             "Building_Restaurant",
             "Building_Restaurant.001",
             "Building_Shoes_Shop",
             "Building_Shoes_Shop.001",
             "Building_Stadium",
             "Building_Super_Market"             
            ];

let dictionary = {};
let url = 0;
names.forEach(item => {
    dictionary[item] = 0;
});
let position = 0;
console.log(dictionary);
let chal = 0;
let dialog_open = false;
let loader = new GLTFLoader();

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
    url = `/src/models/buildings/noncyberpunk/${element}`;
    // loader = new GLTFLoader();
    const cityGroup = new THREE.Group();

loader.load(url, (gltf) => {
    city = gltf.scene;
    
    // Compute bounding box to get the city dimensions
    const bbox = new THREE.Box3().setFromObject(city);
    width = bbox.max.x - bbox.min.x;
    depth = bbox.max.z - bbox.min.z;

    // Center the original city
    city.position.set(0, 0, 0);
    cityGroup.add(city);

    // Clone city and place it at four edges
    const positions = [
        [width, 0, 0],    // Right
        [-width, 0, 0],   // Left
        [0, 0, depth],    // Front
        [0, 0, -depth],
        [width, 0, -depth],    // Right
        [-width, 0, depth],   // Left
        [width, 0, depth],    // Front
        [-width, 0, -depth],
    ];
    // bottom_edge -= depth;
    top_edge += depth;
    // left_edge -= width;
    right_edge += width;

    positions.forEach(pos => {
        const clone = city.clone();
        clone.position.set(...pos);
        cityGroup.add(clone);
    });

    scene.add(cityGroup);

  });
});

    });
let radius = 0;
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

let  movementSpeed = 1;
document.addEventListener('mousedown', (event) =>{
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // isDragging = true;
  startMousePosition = { x : event.clientX , y : event.clientY };
})

let clicked = true;
function isPositionOccupied(position, tolerance = 0.1) {
  return scene.children.some(obj => {
      if (obj.position) {
          return obj.position.distanceTo(position) < tolerance;
      }
      return false;
  });
}
document.addEventListener("keydown", (event) => {
  if (!dialog_open) {
      if (clicked) {
          radius = camera.position.length();
          clicked = false;
      }

      // Move camera
      if (event.key == "w") camera.position.z -= movementSpeed;
      if (event.key == "s") camera.position.z += movementSpeed;
      if (event.key == "a") camera.position.x -= movementSpeed;
      if (event.key == "d") camera.position.x += movementSpeed;

      // Check if camera has moved beyond edges
      if (camera.position.x > Math.abs(left_edge) || camera.position.z > Math.abs(top_edge)) {
          expandCity();
      }
  }
});

// Pooling mechanism to reuse city blocks instead of creating new ones
const cityPool = [];
const maxBlocks = 100; // Maximum number of city blocks in the scene

function getCityBlock() {
  if (cityPool.length > 0) {
      const block = cityPool.pop();
      block.visible = true;
      return block;
  } else {
      return city.clone();
  }
}

function releaseCityBlock(block) {
  block.visible = false;
  cityPool.push(block);
}

function expandCity() {
  const cityGroup = new THREE.Group();
  let newPositions = [];

  if (camera.position.x > right_edge /*&& !isPositionOccupied(new THREE.Vector3(right_edge + width, 0, top_edge - depth))*/) {
      console.log("right");
      newPositions = [
          [right_edge + width, 0, top_edge],
          [right_edge + width, 0, top_edge - depth],
          [right_edge + width, 0, bottom_edge],
      ];
      right_edge += width;
      left_edge += width;
  } if (camera.position.z > top_edge /*&& !isPositionOccupied(new THREE.Vector3(right_edge - width, 0, top_edge + depth))*/) {
      console.log("up");
      newPositions = [
          [right_edge, 0, top_edge + depth],
          [left_edge, 0, top_edge + depth],
          [right_edge - width, 0, top_edge + depth],
      ];
      top_edge += depth;
      bottom_edge += depth;
  } if (camera.position.z < bottom_edge /*&& !isPositionOccupied(new THREE.Vector3(right_edge - width, 0, bottom_edge - depth))*/) {
      console.log("down");
      newPositions = [
          [right_edge - width, 0, bottom_edge - depth],
          [right_edge, 0, bottom_edge - depth],
          [left_edge, 0, bottom_edge - depth],
      ];
      top_edge -= depth;
      bottom_edge -= depth;
  } if (camera.position.x < left_edge /*&& !isPositionOccupied(new THREE.Vector3(left_edge - width, 0, top_edge - depth))*/) {
      console.log("left");
      newPositions = [
          [left_edge - width, 0, top_edge],
          [left_edge - width, 0, top_edge - depth],
          [left_edge - width, 0, bottom_edge],
      ];
      right_edge -= width;
      left_edge -= width;
      console.log(left_edge, width, right_edge);
  }

  // Add new city blocks from pool
  newPositions.forEach((pos) => {
      const block = getCityBlock();
      block.position.set(...pos);
      cityGroup.add(block);
  });

  scene.add(cityGroup);

  // Remove distant city blocks to prevent lag
  // removeDistantBlocks();
}

// function removeDistantBlocks() {
//   while (scene.children.length > maxBlocks) {
//       const oldestBlock = scene.children[0];
//       scene.remove(oldestBlock);
//       releaseCityBlock(oldestBlock);
//   }
// }

        
        // Ensure infinite looping
// Function to get the city size dynamically



document.addEventListener('keyup', () => {
    clicked = true;
});




document.addEventListener("click", (clicked) => {
  clicked.stopPropagation();
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const dialog = document.getElementById("chal_desc"); 
  if (intersects.length !== 0) {
    let clickedObject = intersects[0].object;
    chal = intersects[0].object;
    console.log(chal.name);
    console.log("Clicked Object Solved Status:", dictionary[clickedObject.name]);
    if (dictionary[clickedObject.name] !== 1) {

  if (names.includes(clickedObject.name)){
      const challengeId = clickedObject.name;

      fetch(`http://localhost:3001/api/${challengeId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.desc) {
            dialog.innerHTML = `
              <p>${data.desc}<br>Challenge link: ${data.link}</p>
              <label for="${challengeId}">Enter flag</label>
              <input id="${challengeId}" name="flag">
              <button onclick="submitFlag('${challengeId}')" id="closeDialog">Enter</button>
            `;
            dialog_open = true;
            dialog.addEventListener("click", (event) => {
              event.stopPropagation();
            });

          } else {
            dialog.innerHTML = `
              <p>This challenge is a work in progress, please give us some time.</p>
              <button id="closeDialog">Close</button>
            `;
            dialog_open = true;
            dialog.addEventListener("click", (event) => {
              event.stopPropagation();
            });

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
      dialog.innerHTML = `
        <p>You have already solved this!</p>
        <button id="closeDialog">Close</button>
      `;
      dialog.showModal();
      dialog.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      const closebutton = document.getElementById("closeDialog");
          if (closebutton) {
            closebutton.addEventListener("click", () => {
              event.stopPropagation();
              dialog.close();
              dialog_open = false;
            });
          }
    }}  
});
function infinity(){}

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
      const orientation = chal.quaternion.clone();
      // const name = chal.userData.name;
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
        let foundChild = null;

        model.traverse((child) => {
            if (child.name === chal.name) {  // Match building name
                foundChild = child;
            }
        });

        if (foundChild) {
            foundChild.userData.id = id;
            foundChild.position.copy(position);
            foundChild.quaternion.copy(orientation);
            dictionary[foundChild.name] = 1;
        } else {
            model.position.copy(position);  // Default to whole model
            model.quaternion.copy(orientation);
        }
        console.log(dictionary);
        scene.add(foundChild);
    });

        // scene.add(model);

    }
  } catch (error) {
    console.error("Error:", error);
  }
}


function renderScene() {
  renderer.render(scene, camera);
  // console.log(camera.position.x);

}
renderer.setAnimationLoop(renderScene);
