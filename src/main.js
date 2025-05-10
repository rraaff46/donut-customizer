import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

// Camera and renderer
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0.75, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.75;
controls.enablePan = false;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 2);

const helpLight = new THREE.DirectionalLightHelper(directionalLight, .3);
helpLight.visible = false; // Start hidden for debug mode
scene.add(helpLight);

const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.visible = false;
scene.add(gridHelper);

scene.add(ambientLight, directionalLight);


// Donut model

const manager = new THREE.LoadingManager()


manager.onLoad = () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000); // 3 seconds
}


let donutModel;
let icingMesh;
const loader = new GLTFLoader(manager);
loader.load('models/donut.gltf', (gltf) => {
    donutModel = gltf.scene;
    donutModel.position.set(0, 0, 0);
    donutModel.scale.set(1.5, 1.5, 1.5);
    scene.add(donutModel);

    donutModel.traverse((child) => {
        if (child.isMesh && child.name === "Icing001") {
            icingMesh = child;
            icingMesh.material = icingMesh.material.clone(); // allow independent color
            // icingMesh.material.color.set('#ffffff');
            icingMesh.material.transparent = true;
            icingMesh.material.opacity = 1;
        }
    });
});


// Event listeners, handlers and DOM manipulation
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let debugMode = false;
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') {
        debugMode = !debugMode;
        helpLight.visible = debugMode;
        gridHelper.visible = debugMode;
    }
});

const buttons = document.querySelectorAll('#color-ui button');
buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (icingMesh) {
            icingMesh.material.color.set(color);
        }
    });
});

document.getElementById('close-hint')?.addEventListener('click', () => {
    document.getElementById('debug-hint').style.display = 'none';
});




// Functions

function animate() {
    requestAnimationFrame(animate);

    // if (donutModel) {
    //     donutModel.rotation.y += 0.004;
    //     donutModel.rotation.x += 0.004;
    // }
    controls.update();
    renderer.render(scene, camera);
}
animate();
