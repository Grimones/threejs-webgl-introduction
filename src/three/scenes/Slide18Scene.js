import * as THREE from 'three';
import OrbitControls from '../utils/OrbitControls';

export default class Scene {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    this.renderer.setSize(canvas.width, canvas.height);

    this.camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 1, 10000);
    this.camera.position.setZ(30);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1));
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));

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
