import * as THREE from 'three';

export const ambientLight = new THREE.AmbientLight(0xffffff, 1);

export const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.bias = -0.001;
