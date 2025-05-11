import * as THREE from 'three';

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0.75, 1);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor('#eba4ff');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
