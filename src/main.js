import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

// Camera and renderer
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0.75, 1);
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setClearColor('#eba4ff'); // same as your CSS background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // softer edges
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

// Directional light settings
directionalLight.position.set(1, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.bias = -0.001; // try -0.001 to -0.005


const helpLight = new THREE.DirectionalLightHelper(directionalLight, .3);
helpLight.visible = false; // Start hidden for debug mode
scene.add(helpLight);

const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.visible = false;
scene.add(gridHelper);

scene.add(ambientLight, directionalLight);


// Donut model and loading manager
const manager = new THREE.LoadingManager()
manager.onLoad = () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 20); // 3 seconds
}

let donutModel;
let icingMesh;
let sprinklesMesh;

const loader = new GLTFLoader(manager);
loader.load('models/donut.gltf', (gltf) => {
    donutModel = gltf.scene;
    donutModel.position.set(0, 0, 0);
    donutModel.scale.set(1.5, 1.5, 1.5);
    scene.add(donutModel);

    donutModel.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.name === "Icing001") {
                icingMesh = child;
                icingMesh.material = icingMesh.material.clone(); // allow independent color
                icingMesh.material.transparent = true;
                icingMesh.material.opacity = 1;
            }
        }
    });
});


loader.load('models/sprinkles.gltf', (gltf) => {
    sprinklesMesh = gltf.scene;
    sprinklesMesh.visible = true; // start hidden
    sprinklesMesh.position.set(0, -.001, 0);
    sprinklesMesh.scale.set(1.51, 1.51, 1.51);
    scene.add(sprinklesMesh);

    sprinklesMesh.traverse((child) => {
        if (child.isMesh) {
            // Recalculates vertex normals because I forgot to do this in the original model
            child.geometry.computeVertexNormals();
            const baseColor = child.material.color || new THREE.Color(0xffffff);
            child.castShadow = true;
            child.receiveShadow = false; // optional: they usually don’t need to receive
            child.material = new THREE.MeshStandardMaterial({
                color: baseColor,
                roughness: 0.4,
                metalness: 0.1
            });
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

document.getElementById('toggle-sprinkles')?.addEventListener('click', () => {
    if (sprinklesMesh) {
        sprinklesMesh.visible = !sprinklesMesh.visible;
    }
});

const sprinkleButtons = document.querySelectorAll('.sprinkle-buttons button');
sprinkleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-sprinkle');
        if (sprinklesMesh) {
            sprinklesMesh.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material = child.material.clone();
                    child.material.color.set(color);
                }
            });
        }
    });
});


document.getElementById('save-screenshot')?.addEventListener('click', saveScreenshot);



// Functions

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function saveScreenshot() {
    const ui = document.getElementById('color-ui');
    const hint = document.getElementById('debug-hint');

    // Hide UI
    ui.style.display = 'none';
    hint.style.display = 'none';

    // Wait 1 frame, then capture
    requestAnimationFrame(() => {
        const link = document.createElement('a');
        link.download = 'donut.png';
        link.href = renderer.domElement.toDataURL('image/png');
        link.click();

        // Show UI
        ui.style.display = '';
        hint.style.display = '';
    });
}


animate();
