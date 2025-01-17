import * as THREE from '../node_modules/three/build/three.module.js';
export function clickchecker(){
    const raycaster = new THREE.Raycaster();
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