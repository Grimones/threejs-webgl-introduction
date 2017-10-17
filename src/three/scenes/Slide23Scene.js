import * as THREE from 'three';
import PMREMCubeUVPacker from '../utils/PMREMCubeUVPacker';
import PMREMGenerator from '../utils/PMREMGenerator';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.scene.background = new THREE.Color('#2D2D2D');
    this.lights.keyLight.intensity *= 1.5;
    this.lights.fillLight.intensity *= 1.5;
    this.lights.rimLight.intensity *= 1.5;

    this.camera.position.setZ(20);
    this.camera.position.setY(3);
    this.lookAtVec = new THREE.Vector3(0, 1, 0);

    this.commonColor = '#E2336E';

    this.basic = this.initMeshBasicMaterial();
    this.lambert = this.initMeshLambertMaterial();
    this.phong = this.initMeshPhongMaterial();
    this.standard = this.initMeshStandardMaterial();
    this.physical = this.initMeshPhysicalMaterial();
  }

  initMeshBasicMaterial() {
    const material = new THREE.MeshBasicMaterial({ color: this.commonColor });
    const mesh = this.initSphere(material, false);
    mesh.position.set(0, -2.5, 0);
    return { material, mesh };
  }

  initMeshLambertMaterial() {
    const material = new THREE.MeshLambertMaterial({ color: this.commonColor, reflectivity: 0.1 });
    const mesh = this.initSphere(material, false);
    mesh.position.set(10, -2.5, 0);
    return { material, mesh };
  }

  initMeshPhongMaterial() {
    const material = new THREE.MeshPhongMaterial({ color: this.commonColor, shininess: 1 });
    const mesh = this.initSphere(material, false);
    mesh.position.set(20, -2.5, 0);
    return { material, mesh };
  }

  initMeshStandardMaterial() {
    const material = new THREE.MeshStandardMaterial({ color: this.commonColor, metalness: 1, roughness: 0.6 });
    const mesh = this.initSphere(material, true, true);
    mesh.position.set(30, -2.5, 0);
    return { material, mesh };
  }

  initMeshPhysicalMaterial() {
    const material = new THREE.MeshPhysicalMaterial({ color: this.commonColor, metalness: 1, roughness: 0.8, clearCoat: 1, clearCoatRoughness: 0.25 });
    const mesh = this.initSphere(material, true, true);
    mesh.position.set(40, -2.5, 0);
    return { material, mesh };
  }

  initSphere(material, reflections, pmrem) {
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    if (reflections) {
      const cubeCamera = this.initCubeCamera();
      if (pmrem) {
        const pmrem = this.initPMREM(cubeCamera);
        mesh.pmrem = pmrem;
        material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
      }
      else {
        material.envMap = cubeCamera.renderTarget.texture;
      }
      mesh.add(cubeCamera);
      mesh.cubeCamera = cubeCamera;
    }
    this.scene.add(mesh);
    return mesh;
  }

  initCubeCamera() {
    const cubeCamera = new THREE.CubeCamera( 1, 2000000, 256 );
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.anisotropy = 0;
    return cubeCamera;
  }

  initPMREM(cubeCamera) {
    const pmremGenerator = new PMREMGenerator(cubeCamera.renderTarget.texture);
    const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);

    return {
      generator: pmremGenerator,
      packer: pmremCubeUVPacker
    };
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 0) {
      this.moveCamera(0);
      this.liftDown(this.basic.mesh);
    }
    if (this.step === 1) {
      this.moveCamera(0);
      this.liftUp(this.basic.mesh);
      this.liftDown(this.lambert.mesh);
    }
    if (this.step === 2) {
      this.moveCamera(10);
      this.liftDown(this.basic.mesh);
      this.liftUp(this.lambert.mesh);
      this.liftDown(this.phong.mesh);
    }
    if (this.step === 3) {
      this.moveCamera(20);
      this.liftDown(this.lambert.mesh);
      this.liftUp(this.phong.mesh);
      this.liftDown(this.standard.mesh);
    }
    if (this.step === 4) {
      this.moveCamera(30);
      this.liftDown(this.phong.mesh);
      this.liftUp(this.standard.mesh);
      this.liftDown(this.physical.mesh);
    }
    if (this.step === 5) {
      this.moveCamera(40);
      this.liftDown(this.standard.mesh);
      this.liftUp(this.physical.mesh);
    }
    if (this.step === 6) {
      this.moveCamera(40);
      this.liftDown(this.physical.mesh);
    }
  }

  moveCamera(x) {
    anime({
      targets: [this.camera.position, this.lookAtVec],
      x: x,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  liftUp(mesh) {
    anime({
      targets: mesh.position,
      y: 2.5,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  liftDown(mesh) {
    anime({
      targets: mesh.position,
      y: -2.5,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  animate() {
    this.camera.lookAt(this.lookAtVec);
    super.animate();
  }

  updateReflections(mesh) {
    mesh.visible = false;
    mesh.cubeCamera.update(this.renderer, this.scene);
    if (mesh.pmrem) {
      mesh.pmrem.generator.update(this.renderer);
      mesh.pmrem.packer.update(this.renderer);
    }
    mesh.visible = true;
  }

  renderFrame() {
    this.updateReflections(this.standard.mesh);
    this.updateReflections(this.physical.mesh);
    super.renderFrame();
  }

  dispose() {
    super.dispose();
  }
}
