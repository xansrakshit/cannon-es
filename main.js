import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(8);
scene.add(axesHelper);

camera.position.set(3, 5, 15);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// Physics World
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});

// Create a sphere body
const radius = 1; // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 7, 0); // m
world.addBody(sphereBody);

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
world.addBody(groundBody);

const geometry = new THREE.SphereGeometry(radius);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);
scene.add(sphereMesh);

const cannonDebugger = new CannonDebugger(scene, world);

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // Run the simulation independently of framerate every 1 / 60 ms
  // world stepping...
  world.fixedStep();

  cannonDebugger.update();

  controls.update();

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  // the sphere y position shows the sphere falling
  // console.log(`Sphere y position: ${sphereBody.position.y}`);

  // three.js render...
  renderer.render(scene, camera);
}

animate();
