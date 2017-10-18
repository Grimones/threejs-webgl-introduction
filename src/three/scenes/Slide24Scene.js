import * as THREE from 'three';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.lights.ambientLight.visible = false;
    this.lights.rimLight.visible = false;
    this.lights.fillLight.visible = false;

    this.lights.hemisphereLight.position.set(0, 20, 0);
    this.lights.hemisphereLight.intensity = 0;
    this.hemisphereLightHelper = new THREE.HemisphereLightHelper(this.lights.hemisphereLight, 5);
    this.scene.add(this.hemisphereLightHelper);

    this.lights.keyLight.position.set(-30, 40, 30);
    this.lights.keyLight.intensity = 0;
    this.keyLightHelper = new THREE.DirectionalLightHelper(this.lights.keyLight);
    this.scene.add(this.keyLightHelper);
    this.keyLightHelper.visible = false;

    // point light
    this.pLight = new THREE.PointLight( '#fff', 0 );
    this.pLight.position.set(-30, 40, 30);
    this.scene.add( this.pLight );
    this.pLightHelper = new THREE.PointLightHelper( this.pLight, 5 );
    this.scene.add( this.pLightHelper );
    this.pLightHelper.visible = false;


    // spot light
    this.sLight = new THREE.SpotLight( '#fff', 0, 0, Math.PI / 9, 0.4 ); // hex, intensity, distance, angle, penumbra
    this.sLight.position.set(-30, 40, 30);
    this.scene.add( this.sLight );

    this.sLight.castShadow = true;
    this.sLightHelper = new THREE.SpotLightHelper( this.sLight );
    this.scene.add( this.sLightHelper );
    this.sLightHelper.visible = false;


    this.camera.position.z += 60;
    this.camera.position.y += 50;
    this.mesh = this.initMesh();
    this.plane = this.initPlane();
  }

  initPlane() {
    const geometry = new THREE.PlaneGeometry(150, 150);
    const material = new THREE.MeshStandardMaterial({ color: '#fff' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI / -2);
    mesh.position.setY(-10);
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  initMesh() {
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: '#E2336E' });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 1) {
      anime({
        targets: this.lights.hemisphereLight,
        intensity: 10,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 2) {
      anime({
        targets: this.lights.hemisphereLight.color,
        r: 0,
        g: 1,
        b: 0,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 3) {
      anime({
        targets: this.lights.hemisphereLight,
        intensity: 0,
        easing: 'easeInOutQuad',
        duration: 700,
        complete: () => { this.hemisphereLightHelper.visible = false; }
      });
    }
    if (this.step === 4) {
      this.keyLightHelper.visible = true;
      anime({
        targets: this.lights.keyLight,
        intensity: 2,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 5) {
      anime({
        targets: this.lights.keyLight.position,
        x: 30,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 6) {
      this.keyLightHelper.visible = false;
      anime({
        targets: this.lights.keyLight,
        intensity: 0,
        easing: 'easeInOutQuad',
        duration: 700
      });
      this.pLightHelper.visible = true;
      anime({
        targets: this.pLight,
        intensity: 1,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 7) {
      anime({
        targets: this.pLight.position,
        x: 20,
        y: 5,
        z: 10,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 8) {
      this.pLightHelper.visible = false;
      anime({
        targets: this.pLight,
        intensity: 0,
        easing: 'easeInOutQuad',
        duration: 700
      });
      this.sLightHelper.visible = true;
      anime({
        targets: this.sLight,
        intensity: 2,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 9) {
      anime({
        targets: this.sLight,
        angle: Math.PI / 16,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 10) {
      anime({
        targets: this.sLight,
        angle: Math.PI / 8,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 11) {
      anime({
        targets: this.sLight,
        penumbra: 0,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 12) {
      anime({
        targets: this.sLight,
        penumbra: 0.8,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 13) {
      this.mesh.castShadow = true;
    }
  }

  animate() {
    super.animate();
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));
    this.keyLightHelper.update();
    this.sLightHelper.update();
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
