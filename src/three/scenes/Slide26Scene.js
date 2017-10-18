import * as THREE from 'three';
import anime from 'animejs';
import BasicScene from './BasicScene';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.camera.position.setZ(500);
    this.screenPosition = 400;
    this.perspective = this.initPerspectiveCamera();
    this.cubes = this.initCubes();
    this.cursor = this.initCursor();

    this.animateCursor();
    this.initScreenHelper();

    this.raycaster = new THREE.Raycaster();
    this.lookAtVector = new THREE.Vector3();
  }

  initPerspectiveCamera() {
    const camera = new THREE.PerspectiveCamera(80, 16 / 9, 50, 1000);
    camera.position.setZ(this.screenPosition + 50);
    const helper = new THREE.CameraHelper(camera);
    helper.visible = false;
    this.scene.add(helper);
    camera.updateProjectionMatrix();
    helper.update();
    this.renderer.render(this.scene, camera);
    return { camera, helper };
  }

  initCubes() {
    const geometry = new THREE.BoxGeometry( 30, 30, 30 );

    const group = new THREE.Group();
    this.scene.add( group );

    for ( let i = 0; i < 300; i++ ) {
      const range = 400;
      const object = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { color: '#fff' } ) );

      object.position.x = range * (0.5 - Math.random());
      object.position.y = range * (0.5 - Math.random());
      object.position.z = range * (0.75 - Math.random());

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      group.add( object );
    }
    return group;
  }

  initCursor() {
    const cursorGeo = new THREE.PlaneBufferGeometry( 10, 10, 1, 1 );
    const loader = new THREE.TextureLoader();
    const map = loader.load( 'assets/cursor.png' );
    const cursorMat = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, map: map, transparent: true } );
    const mesh = new THREE.Mesh( cursorGeo, cursorMat );
    mesh.position.set( -40, -20, this.screenPosition );
    const helper = new THREE.ArrowHelper( new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), 1100, 0xff0000, 70 );
    mesh.add( helper );

    this.scene.add(mesh);

    return { mesh, helper };
  }

  animateCursor() {
    const timeline = anime.timeline({
      direction: 'alternate',
      easing: 'easeInOutQuad',
      loop: true
    });
    timeline.add({
      targets: this.cursor.mesh.position,
      x: 60,
      duration: 3000
    }).add({
      targets: this.cursor.mesh.position,
      y: 10,
      duration: 2000,
      offset: 100
    }).add({
      targets: this.cursor.mesh.position,
      x: -60,
      duration: 3000,
      delay: 1000
    }).add({
      targets: this.cursor.mesh.position,
      y: -20,
      duration: 2000,
      offset: 4000
    });
  }

  initScreenHelper() {
    const grid = new THREE.GridHelper( 9.5, 1 );
    grid.rotation.x = Math.PI / 2;
    grid.scale.x *= 16;
    grid.scale.z *= 9;
    grid.position.z = this.screenPosition;
    this.scene.add( grid );
  }

  raycast() {
    const matrix = new THREE.Matrix4();
    matrix.extractRotation( this.cursor.mesh.matrix );

    const direction = new THREE.Vector3( 0, 0, -1 ).applyMatrix4( matrix );

    this.raycaster.set( this.cursor.mesh.position, direction );

    const intersects = this.raycaster.intersectObjects( this.cubes.children );
    return intersects;
  }

  animate() {
    for (let i = 0; i < this.cubes.children.length; i++) {
      this.cubes.children[i].material.color.setRGB(1, 1, 1);
    }

    const intersections = this.raycast();
    for (let i = 0; i < intersections.length; i++) {
      const intersectedObject = intersections[i].object;
      intersectedObject.material.color.setRGB(0.886, 0.2, 0.431);
    }
    this.camera.lookAt(this.lookAtVector);
    super.animate();
  }

  setStep(step) {
    super.setStep(step);

    if (this.step === 1) {
      anime({
        targets: this.camera.position,
        x: -800,
        y: 100,
        z: -100,
        easing: 'easeInOutQuad',
        duration: 1700
      });
      anime({
        targets: this.lookAtVector,
        z: 150,
        easing: 'easeInOutQuad',
        duration: 1700
      });
    }
    if (this.step === 2) {
      this.perspective.helper.visible = true;
    }
  }

  dispose() {
    super.dispose();
  }
}
