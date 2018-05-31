import * as THREE from 'three';
import OrbitControls from '../utils/OrbitControls';

export default class Scene {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    this.renderer.setSize(canvas.width, canvas.height);
    this.renderer.physicallyCorrectLights = true;

    this.camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 10000);
    this.camera.position.setZ(45);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = true;

    this.scene = new THREE.Scene();
    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1);

    this.keyLight = new THREE.DirectionalLight('#fff', 1.7);
    this.keyLight.position.set(-80, 60, 80);

    this.fillLight = new THREE.DirectionalLight('#fff', 1.3);
    this.fillLight.position.set(80, 40, 40);

    this.rimLight = new THREE.DirectionalLight('#fff', 1.6);
    this.rimLight.position.set(-20, 80, -80);
    this.scene.add(
      this.hemisphereLight,
      this.ambientLight,
      this.keyLight,
      this.fillLight,
      this.rimLight
    );

    const geometry = new THREE.OctahedronGeometry(8, 2);
    const material = new THREE.MeshStandardMaterial({ color: '#E2336E', flatShading: true });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.clock = new THREE.Clock();
    this.requestLoop = undefined;
  }

  resizeRenderer(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  loopRender = () => {
    const delta = this.clock.getDelta();
    this.mesh.rotation.y += delta;
    this.renderer.render(this.scene, this.camera);
    this.requestLoop = requestAnimationFrame(this.loopRender);
  }

  stop() {
    if (this.requestLoop) {
      cancelAnimationFrame(this.requestLoop);
      this.requestLoop = undefined;
    }
  }

  dispose() {
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
    this.scene = null;
    this.camera = null;

    this.controls.dispose();

    this.mesh.geometry.dispose();
    this.mesh.geometry = null;
    this.mesh.material.dispose();
    this.mesh.material = null;
    this.mesh = null;

    this.renderer.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer.canvas = null;
    this.renderer = null;
    this.canvas = null;
  }
}
