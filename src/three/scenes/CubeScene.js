import * as THREE from 'three';
import BasicScene from './BasicScene';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.cube = this.initCube();
  }

  initCube() {
    const geometry = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
    this.scene.add(mesh);
    return mesh;
  }

  dispose() {
    this.cube.geometry.dispose();
    this.cube.material.dispose();
    super.dispose();
  }
}
