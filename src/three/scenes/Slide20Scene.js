import * as THREE from 'three';
import BasicScene from './BasicScene';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.grid = this.initGrid();
  }

  initGrid() {
    const grid = new THREE.GridHelper(500, 1000, '#262626', '#3d3d3d');
    this.scene.add(grid);
    return grid;
  }

  animate() {
    super.animate();
    const delta = this.clock.getDelta();
  }
}
