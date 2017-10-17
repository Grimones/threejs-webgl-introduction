import * as THREE from 'three';
import anime from 'animejs';
import BasicScene from './BasicScene';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.renderer.autoClear = false;

    this.camera.position.setY(50);
    this.camera.position.setX(50);
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));
    this.camera.aspect = (canvas.width / 2) / canvas.height;
    this.camera.updateProjectionMatrix();

    this.perspective = this.initPerspectiveCamera(canvas);
    this.orthographic = this.initOrthographicCamera(canvas);
    this.active = this.perspective;

    this.initMesh().then(mesh => {
      this.mesh = mesh;
    });
    this.grid = this.initGrid();
  }

  initMesh() {
    return new Promise(resolve => {
      const loader = new THREE.JSONLoader();
      loader.load('assets/suzanne.json', geometry => {
        const material = new THREE.MeshStandardMaterial({ color: '#E2336E', flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.multiplyScalar(0.25);
        this.scene.add(mesh);
        resolve(mesh);
      });
    });
    // const geometry = new THREE.OctahedronGeometry(1, 2);
  }

  initPerspectiveCamera(canvas) {
    const camera = new THREE.PerspectiveCamera(30, (canvas.width / 2) / canvas.height, 5, 40);
    camera.position.setY(7);
    const helper = new THREE.CameraHelper(camera);
    helper.visible = false;
    this.scene.add(helper);
    return { camera, helper };
  }

  initOrthographicCamera(canvas) {
    const { width, height } = canvas;
    const camera = new THREE.OrthographicCamera( 0.5 * width / -75, 0.5 * width / 75, height / 75, height / -75, 5, 30);
    camera.position.setY(7);
    const helper = new THREE.CameraHelper(camera);
    helper.visible = false;
    this.scene.add(helper);
    return { camera, helper };

  }

  initGrid() {
    const grid = new THREE.GridHelper(5000, 2500, '#262626', '#4d4d4d');
    this.scene.add(grid);
    return grid;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 1) {
      anime({
        targets: this.active.camera,
        fov: 75,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 2) {
      anime({
        targets: this.active.camera,
        near: 10,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 3) {
      anime({
        targets: this.active.camera,
        far: 30,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 4) {
      anime({
        targets: this.active.camera,
        fov: 20,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 5) {
      this.active = this.orthographic;
      this.perspective.helper.visible = false;
    }
  }

  renderFrame() {
    this.renderer.clear();
    this.renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    this.active.helper.visible = false;
    this.renderer.render(this.scene, this.active.camera);
    this.renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
    this.active.helper.visible = true;
    super.renderFrame();
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    this.active.camera.updateProjectionMatrix();
    this.active.helper.update();
    this.active.camera.position.x = 15 * Math.cos( elapsedTime * 0.25);
    this.active.camera.position.z = 15 * Math.sin( elapsedTime * 0.25 );
    if (this.mesh) {
      this.active.camera.lookAt(this.mesh.position);
    }
    super.animate();
  }
}
