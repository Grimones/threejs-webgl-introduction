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
    this.lights = this.initLights();
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
      antialias: true
      // logarithmicDepthBuffer: true
    });
    renderer.setSize(this.canvas.width, this.canvas.height);
    renderer.autoClear = true;
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMapSoft = true;
    return renderer;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(45, this.canvas.width / this.canvas.height, 1, 10000);
    camera.position.setZ(30);
    return camera;
  }

  initOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enabled = true;
    controls.enableKeys = false;
    return controls;
  }

  initScene() {
    const scene = new THREE.Scene();
    return scene;
  }

  initLights() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    const keyLight = new THREE.DirectionalLight('#fff', 1.7);
    keyLight.castShadow = true;
    keyLight.position.set(-80, 60, 80);

    const fillLight = new THREE.DirectionalLight('#fff', 1.3);
    fillLight.castShadow = true;
    fillLight.position.set(80, 40, 40);

    const rimLight = new THREE.DirectionalLight('#fff', 1.6);
    rimLight.castShadow = true;
    rimLight.position.set(-20, 80, -80);
    this.scene.add(
      hemisphereLight,
      ambientLight,
      keyLight,
      fillLight,
      rimLight
    );

    // const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 15);
    // const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 15);
    // const rimLightHelper = new THREE.DirectionalLightHelper(rimLight, 15);
    // this.scene.add(keyLightHelper, rimLightHelper, fillLightHelper);
    return {
      hemisphereLight,
      ambientLight,
      keyLight,
      fillLight,
      rimLight
    };
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
