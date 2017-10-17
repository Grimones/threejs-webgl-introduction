import * as THREE from 'three';
import PMREMCubeUVPacker from '../utils/PMREMCubeUVPacker';
import PMREMGenerator from '../utils/PMREMGenerator';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.scene.background = new THREE.Color('#2D2D2D');
    this.lights.keyLight.intensity *= 1.5;
    this.lights.fillLight.intensity *= 1.5;
    this.lights.rimLight.intensity *= 1.5;

    this.camera.position.setZ(32);
    this.camera.position.setY(3);
    this.commonMaterial = new THREE.MeshStandardMaterial({
      color: '#E2336E',
      metalness: 1.0,
      roughness: 0.7
    });
    this.sphere = this.initSphere();
    this.cube = this.initCube();
    this.cylinder = this.initCylinder();
    this.torus = this.initTorus();
  }

  initSphere() {
    const cubeCamera = this.initCubeCamera();
    const pmrem = this.initPMREM(cubeCamera);
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    const material = this.commonMaterial.clone();
    material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.add(cubeCamera);
    mesh.cubeCamera = cubeCamera;
    mesh.pmrem = pmrem;
    mesh.position.set(-15, -2.5, 0);
    this.scene.add(mesh);
    return mesh;
  }

  initCube() {
    const cubeCamera = this.initCubeCamera();
    const pmrem = this.initPMREM(cubeCamera);
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = this.commonMaterial.clone();
    material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.add(cubeCamera);
    mesh.cubeCamera = cubeCamera;
    mesh.pmrem = pmrem;
    mesh.position.set(-5, -2.5, 0);
    this.scene.add(mesh);
    return mesh;
  }

  initCylinder() {
    const cubeCamera = this.initCubeCamera();
    const pmrem = this.initPMREM(cubeCamera);
    const geometry = new THREE.CylinderGeometry(2, 2, 5, 32);
    const material = this.commonMaterial.clone();
    material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.add(cubeCamera);
    mesh.cubeCamera = cubeCamera;
    mesh.pmrem = pmrem;
    mesh.position.set(5, -2.5, 0);
    this.scene.add(mesh);
    return mesh;
  }

  initTorus() {
    const cubeCamera = this.initCubeCamera();
    const pmrem = this.initPMREM(cubeCamera);
    const geometry = new THREE.TorusGeometry(2.5, 0.75, 36, 36);
    const material = this.commonMaterial.clone();
    material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.add(cubeCamera);
    mesh.cubeCamera = cubeCamera;
    mesh.pmrem = pmrem;
    mesh.position.set(15, -2.5, 0);
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

    const pmrem = {
      generator: pmremGenerator,
      packer: pmremCubeUVPacker
    };

    return pmrem;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 1) {
      anime({
        targets: this.sphere.position,
        y: '2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 2) {
      anime({
        targets: this.sphere.position,
        y: '-2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
      anime({
        targets: this.cube.position,
        y: '2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 3) {
      this.rotateBack(this.cube, 'x');
      this.rotateBack(this.cube, 'y');
      anime({
        targets: this.cube.position,
        y: '-2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
      anime({
        targets: this.cylinder.position,
        y: '2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 4) {
      this.rotateBack(this.cylinder, 'x');
      anime({
        targets: this.cylinder.position,
        y: '-2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
      anime({
        targets: this.torus.position,
        y: '2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 5) {
      this.rotateBack(this.torus, 'y');
      anime({
        targets: this.torus.position,
        y: '-2.5',
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
  }

  rotateBack(mesh, axis) {
    const currentRotation = THREE.Math.radToDeg(mesh.rotation[axis]);
    const backRotation = currentRotation - (currentRotation % 360);
    anime({
      targets: mesh.rotation,
      [axis]: THREE.Math.degToRad(backRotation),
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  animate() {
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));
    const delta = this.clock.getDelta();
    if (this.step === 2) {
      this.cube.rotation.x += delta;
      this.cube.rotation.y += delta;
    }
    if (this.step === 3) {
      this.cylinder.rotation.x += delta;
    }
    if (this.step === 4) {
      this.torus.rotation.y += delta;
    }
    super.animate();
  }

  updateReflections(mesh) {
    mesh.pmrem.generator.update(this.renderer);
    mesh.pmrem.packer.update(this.renderer);
    mesh.visible = false;
    mesh.cubeCamera.updateCubeMap(this.renderer, this.scene);
    mesh.visible = true;
  }

  renderFrame() {
    this.updateReflections(this.sphere);
    this.updateReflections(this.cube);
    this.updateReflections(this.cylinder);
    this.updateReflections(this.torus);
    super.renderFrame();
  }

  dispose() {
    this.sphere.geometry.dispose();
    this.sphere.geometry = null;
    this.sphere.material.dispose();
    this.sphere.material = null;
    this.sphere = null;
    this.cube.geometry.dispose();
    this.cube.geometry = null;
    this.cube.material.dispose();
    this.cube.material = null;
    this.cube = null;
    this.cylinder.geometry.dispose();
    this.cylinder.geometry = null;
    this.cylinder.material.dispose();
    this.cylinder.material = null;
    this.cylinder = null;
    super.dispose();
  }
}
