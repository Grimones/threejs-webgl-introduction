import * as THREE from 'three';
import OrbitControls from '../utils/OrbitControls';
import Stats from 'stats.js';

export default class Scene {
  constructor(canvas, showStats, useControls) {
    this.canvas = canvas;
    this.renderer = this.initRenderer(canvas);
    this.camera = this.initCamera();
    if (useControls) {
      this.controls = this.initOrbitControls();
    }
    this.scene = this.initScene();
    if (showStats) {
      this.stats = this.initStats();
    }
    this.clock = this.initClock();
    this.requestLoop = undefined;
    this.step = 0;
  }

  initRenderer(canvas) {
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true
    });
    renderer.setSize(this.canvas.width, this.canvas.height);
    return renderer;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 1, 10000);
    camera.position.setZ(30);
    return camera;
  }

  initOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enabled = true;
    return controls;
  }

  initScene() {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1));
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    return scene;
  }

  initStats() {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return stats;
  }

  initClock() {
    return new THREE.Clock();
  }

  setStep(step) {
    this.step = step;
  }

  resizeRenderer(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  loopRender() {
    this.requestLoop = requestAnimationFrame(this.loopRender.bind(this));
    if (this.stats) {
      this.stats.begin();
    }
    this.animate();
    this.renderFrame();
    if (this.stats) {
      this.stats.end();
    }
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
    if (this.controls) {
      this.controls.dispose();
    }

    this.renderer.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer.canvas = null;
    this.renderer = null;
    this.canvas = null;

    if (this.stats) {
      document.body.removeChild(this.stats.dom);
      this.stats.dom = null;
      this.stats = null;
    }
  }
}
