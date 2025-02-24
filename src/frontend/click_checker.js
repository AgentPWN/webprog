import * as THREE from '/node_modules/three/build/three.module.js';
export function clickchecker(scene,camera,mouse){
    const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
    
        if (clickedObject.name === 'button') {
          console.log("clicked button");
          return true;
        } else {
          console.log("clicked object")
          return false;
        }
      } else {
        console.log('No intersections detected');
      }
    }
