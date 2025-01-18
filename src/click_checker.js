import * as THREE from '../node_modules/three/build/three.module.js';
export function clickchecker(scene,camera){
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    
    document.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
}