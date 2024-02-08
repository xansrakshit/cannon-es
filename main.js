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

// Physics World
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
});

// Create a static plane for the ground
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC, // can also be achieved by setting the mass to 0
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
world.addBody(groundBody);

const cannonDebugger = new CannonDebugger(scene, world);

const carBody = new CANNON.Body({
  mass: 5,
  position: new CANNON.Vec3(0, 6, 0),
  shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
});
const vehicle = new CANNON.RigidVehicle({
  chassisBody: carBody,
});

vehicle.addToWorld(world);

function animate() {
  requestAnimationFrame(animate);
  // world stepping...
  world.fixedStep();
  cannonDebugger.update();
  controls.update();
  renderer.render(scene, camera);
}

animate();
