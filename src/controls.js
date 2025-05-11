import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera, rendererDomElement) {
    const controls = new OrbitControls(camera, rendererDomElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.75;
    controls.enablePan = false;
    return controls;
}
