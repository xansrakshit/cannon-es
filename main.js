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

// Add wheels to the vehicle
const mass = 1,
  axisWidth = 5,
  wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material("wheel");
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3(-2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

vehicle.addToWorld(world);

document.addEventListener("keydown", (event) => {
  const maxSteerVal = Math.PI / 8;
  const maxForce = 50;
  const brakeForce = 100;
  // console.log(event.code);
  // console.log(vehicle);
  console.log(event.key);
  switch (event.key) {
    case "w":
    case "ArrowUp":
      vehicle.setWheelForce(maxForce, 0);
      vehicle.setWheelForce(maxForce, 1);
      break;

    case "s":
    case "ArrowDown":
      vehicle.setWheelForce(-maxForce / 2, 0);
      vehicle.setWheelForce(-maxForce / 2, 1);
      break;

    case "a":
    case "ArrowLeft":
      vehicle.setSteeringValue(maxSteerVal, 0);
      vehicle.setSteeringValue(maxSteerVal, 1);
      break;

    case "d":
    case "ArrowRight":
      vehicle.setSteeringValue(-maxSteerVal, 0);
      vehicle.setSteeringValue(-maxSteerVal, 1);
      break;

    // case " ":
    // case "Space":
    //   // Apply brakes
    //   vehicle.setWheelForce(-brakeForce, 0); // Apply brake force to front wheels
    //   vehicle.setWheelForce(-brakeForce, 1); // Apply brake force to rear wheels
    //   break;
  }
});

// reset car force to zero when key is released
document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
    case "ArrowUp":
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case "s":
    case "ArrowDown":
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case "a":
    case "ArrowLeft":
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;

    case "d":
    case "ArrowRight":
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;
  }
});

// groundBody.quaternion.setFromEuler(-Math.PI / 2, Math.PI / 24, 0);
// sync game world with physics world
const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

const sphereGeometry1 = new THREE.SphereGeometry(1);
const sphereMaterial1 = new THREE.MeshNormalMaterial();
const sphereMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
scene.add(sphereMesh1);

const sphereGeometry2 = new THREE.SphereGeometry(1);
const sphereMaterial2 = new THREE.MeshNormalMaterial();
const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
scene.add(sphereMesh2);

const sphereGeometry3 = new THREE.SphereGeometry(1);
const sphereMaterial3 = new THREE.MeshNormalMaterial();
const sphereMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
scene.add(sphereMesh3);

const sphereGeometry4 = new THREE.SphereGeometry(1);
const sphereMaterial4 = new THREE.MeshNormalMaterial();
const sphereMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
scene.add(sphereMesh4);

function syncGamePhyWorld() {
  boxMesh.position.copy(carBody.position);
  boxMesh.quaternion.copy(carBody.quaternion);
  sphereMesh1.position.copy(wheelBody1.position);
  sphereMesh1.quaternion.copy(wheelBody1.quaternion);
  sphereMesh2.position.copy(wheelBody2.position);
  sphereMesh2.quaternion.copy(wheelBody2.quaternion);
  sphereMesh3.position.copy(wheelBody3.position);
  sphereMesh3.quaternion.copy(wheelBody3.quaternion);
  sphereMesh4.position.copy(wheelBody4.position);
  sphereMesh4.quaternion.copy(wheelBody4.quaternion);
}

function animate() {
  requestAnimationFrame(animate);
  // world stepping...
  world.fixedStep();
  cannonDebugger.update();
  controls.update();
  syncGamePhyWorld();
  renderer.render(scene, camera);
}

animate();
