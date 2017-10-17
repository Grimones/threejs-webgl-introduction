import * as THREE from 'three';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.camera.position.z += 15;
    this.mesh = this.initMesh();
  }

  initMesh() {
    const geometry = new THREE.OctahedronGeometry(8, 2);
    const material = new THREE.MeshStandardMaterial({ color: '#E2336E', flatShading: true });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 1) {
      anime({
        targets: this.mesh.position,
        x: 15,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    else if (this.step === 2) {
      anime({
        targets: this.mesh.position,
        x: -5,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    else if (this.step === 3) {
      anime({
        targets: this.mesh.scale,
        x: 2,
        y: 2,
        z: 2,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    else if (this.step === 4) {
      anime({
        targets: this.mesh.scale,
        y: 0.5,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    else if (this.step === 5) {
      anime({
        targets: this.mesh.rotation,
        z: THREE.Math.degToRad(90),
        easing: 'easeInOutQuad',
        duration: 3000
      });
    }
    else if (this.step === 6) {
      anime({
        targets: this.mesh.scale,
        z: 0.5,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    else if (this.step === 7) {
      anime({
        targets: this.mesh.scale,
        x: 0.5,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
  }

  animate() {
    super.animate();

    const delta = this.clock.getDelta();
    this.mesh.rotation.y += delta;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.geometry = null;
    this.mesh.material.dispose();
    this.mesh.material = null;
    this.mesh = null;
    super.dispose();
  }
}
