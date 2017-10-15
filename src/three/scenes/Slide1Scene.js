import * as THREE from 'three';
import CubeScene from './CubeScene';

export default class Scene extends CubeScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.cube.material.color = new THREE.Color('#FFF');
  }

  animate() {
    super.animate();
    const delta = this.clock.getDelta();
    this.cube.rotation.x += delta;
    this.cube.rotation.z += delta;
  }
}
