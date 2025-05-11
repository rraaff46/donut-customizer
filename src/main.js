import './style.css';
import * as THREE from 'three';
import { scene, camera, renderer } from './sceneSetup.js';
import { ambientLight, directionalLight } from './lights.js';
import { setupControls } from './controls.js';
import { loadModels } from './loadModels.js';
import { setupUI } from './ui.js';

scene.add(ambientLight, directionalLight);

// Debug helpers
const helpLight = new THREE.DirectionalLightHelper(directionalLight, 0.3);
helpLight.visible = false;
scene.add(helpLight);

const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.visible = false;
scene.add(gridHelper);

// Loading manager
const manager = new THREE.LoadingManager();
manager.onLoad = () => {
    setTimeout(() => {
        document.getElementById('loader')?.classList.add('hidden');
    }, 20);
};

// Camera controls
const controls = setupControls(camera, renderer.domElement);

// Load models & setup UI
loadModels(scene, manager).then(({ icingMesh, sprinklesMesh }) => {
    setupUI({ scene, camera, renderer, controls, icingMesh, sprinklesMesh });
});

// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
