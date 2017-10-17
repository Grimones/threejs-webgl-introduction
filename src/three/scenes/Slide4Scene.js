import * as THREE from 'three';
import BasicScene from './BasicScene';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.camera.position.z += 5;
    this.initMesh().then(mesh => {
      this.mesh = mesh;
    });
  }

  initMesh() {
    const loader = new THREE.JSONLoader();
    return new Promise(resolve => {
      loader.load('assets/teapot.json', geometry => {
        const material = new THREE.MeshStandardMaterial({ color: '#fff', metalness: 1, roughness: 0.7 });
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.scale.set(1.001, 1.001, 1.001);
        line.material.color = new THREE.Color('#fff');
        line.material.opacity = 0.25;
        line.material.transparent = true;

        const mesh = new THREE.Mesh(geometry, material);

        mesh.add(line);
        mesh.scale.set(1.5, 1.5, 1.5);
        mesh.position.y -= 1.5;

        this.scene.add(mesh);
        resolve(mesh);
      });
    });
  }

  animate() {
    super.animate();
    if (this.mesh) {
      const delta = this.clock.getDelta() / 2;
      this.mesh.rotation.y -= delta;
    }
  }
}
