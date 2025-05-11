import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModels(scene, manager) {
    const loader = new GLTFLoader(manager);

    return new Promise((resolve) => {
        let icingMesh = null;
        let sprinklesMesh = null;

        let donutLoaded = false;
        let sprinklesLoaded = false;

        const checkIfDone = () => {
            if (donutLoaded && sprinklesLoaded) {
                resolve({ icingMesh, sprinklesMesh });
            }
        };

        loader.load('models/donut.gltf', (gltf) => {
            const donutModel = gltf.scene;
            donutModel.scale.set(1.5, 1.5, 1.5);
            donutModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.name === "Icing001") {
                        icingMesh = child;
                        icingMesh.material = icingMesh.material.clone();
                        icingMesh.material.transparent = true;
                        icingMesh.material.opacity = 1;
                    }
                }
            });
            scene.add(donutModel);
            donutLoaded = true;
            checkIfDone();
        });

        loader.load('models/sprinkles.gltf', (gltf) => {
            sprinklesMesh = gltf.scene;
            sprinklesMesh.visible = true;
            sprinklesMesh.scale.set(1.51, 1.51, 1.51);
            sprinklesMesh.position.set(0, -0.001, 0);
            sprinklesMesh.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.computeVertexNormals();
                    const baseColor = child.material.color || new THREE.Color(0xffffff);
                    child.castShadow = true;
                    child.receiveShadow = false;
                    child.material = new THREE.MeshStandardMaterial({
                        color: baseColor,
                        roughness: 0.4,
                        metalness: 0.1
                    });
                }
            });
            scene.add(sprinklesMesh);
            sprinklesLoaded = true;
            checkIfDone();
        });
    });
}
