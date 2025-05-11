export function setupUI({ scene, renderer, camera, icingMesh, sprinklesMesh }) {
    const helpLight = scene.getObjectByProperty('type', 'DirectionalLightHelper');
    const gridHelper = scene.getObjectByProperty('type', 'GridHelper');

    // Toggle debug mode
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'g') {
            const debugMode = !helpLight.visible;
            helpLight.visible = debugMode;
            gridHelper.visible = debugMode;
        }
    });

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Save screenshot
    document.getElementById('save-screenshot')?.addEventListener('click', () => {
        const ui = document.getElementById('color-ui');
        const hint = document.getElementById('debug-hint');
        ui.style.display = 'none';
        hint.style.display = 'none';

        requestAnimationFrame(() => {
            const link = document.createElement('a');
            link.download = 'donut.png';
            link.href = renderer.domElement.toDataURL('image/png');
            link.click();
            ui.style.display = '';
            hint.style.display = '';
        });
    });

    // Icing color buttons
    document.querySelectorAll('button[data-color]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            if (icingMesh) {
                icingMesh.material.color.set(color);
            }
        });
    });

    // Toggle sprinkles
    document.getElementById('toggle-sprinkles')?.addEventListener('click', () => {
        if (sprinklesMesh) {
            sprinklesMesh.visible = !sprinklesMesh.visible;
        }
    });

    // Sprinkle color buttons
    document.querySelectorAll('button[data-sprinkle]').forEach((btn) => {
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

    // Close button
    document.getElementById('close-hint')?.addEventListener('click', () => {
        document.getElementById('debug-hint').style.display = 'none';
    });
}
