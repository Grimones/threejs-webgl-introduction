import * as THREE from 'three';
import OrbitControls from '../OrbitControls';
import Stats from 'stats.js';

export default class BasicScene {
  constructor(canvas, useControls, showStats) {
    this.canvas = canvas;
    this.renderer = this.initRenderer(canvas);
    this.camera = this.initCamera();
    if (true) {
      this.controls = this.initOrbitControls();
    }
    this.scene = this.initScene();
    if (showStats) {
      this.stats = this.initStats();
    }
    this.clock = this.initClock();
    this.loopRenderRequest = undefined;
    this.loopRender = this.loopRender.bind(this);
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
    const camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 10, 10000);
    return camera;
  }

  initOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enabled = true;
    return controls;
  }

  initScene() {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.7));
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
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

  setCanvas(canvas) {
    this.canvas = canvas;
    this.renderer.domElement = canvas;
  }

  resizeRenderer(viewport) {
    const { width, height } = viewport;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.position.setX(0);
    this.camera.position.setY(0);
    this.camera.updateProjectionMatrix();
  }

  animate() {
  }

  renderFrame() {
    this.renderer.render(this.scene, this.camera);
  }

  loopRender() {
    this.loopRenderRequest = requestAnimationFrame(this.loopRender);
    if (this.stats) {
      this.stats.begin();
    }
    this.animate();
    this.renderFrame();
    if (this.stats) {
      this.stats.end();
    }
  }

  stopLoopRender() {
    if (this.loopRenderRequest) {
      cancelAnimationFrame(this.loopRenderRequest);
      this.loopRenderRequest = undefined;
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

    this.clock = null;
  }
}
