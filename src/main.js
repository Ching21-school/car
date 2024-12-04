import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

// Set up the camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// Move the camera farther away from the hamburger model for a wider view
camera.position.set(6, 4, 10); // Set the camera even farther back (zoom out)
camera.lookAt(0, 0, 0); // Ensure the camera is looking at the center of the scene

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  'public/models/Sports Car.glb', // Path to the GLB model
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Adjust model's position to raise it above the ground
    model.position.set(0, 0.3, 0); // Raise the model 0.3 units on the Y-axis
    scene.add(model);
  },
  (xhr) => console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`),
  (error) => console.error('An error occurred:', error)
);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth movement

const gui = new GUI();
const options = {
  ambientLightIntensity: 0.6,
  directionalLightIntensity: 0.8,
  shadowsEnabled: true,
};

gui.add(options, 'ambientLightIntensity', 0, 1).name('Ambient Light').onChange((value) => {
  ambientLight.intensity = value;
});
gui.add(options, 'directionalLightIntensity', 0, 2).name('Directional Light').onChange((value) => {
  directionalLight.intensity = value;
});
gui.add(options, 'shadowsEnabled').name('Enable Shadows').onChange((value) => {
  renderer.shadowMap.enabled = value;
  directionalLight.castShadow = value;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required for damping
  renderer.render(scene, camera);
}

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
