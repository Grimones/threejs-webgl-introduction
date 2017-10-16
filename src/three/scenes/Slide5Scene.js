import * as THREE from 'three';
import { SpriteText2D, textAlign } from 'three-text2d';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, useControls);

    this.camera.position.set(0, -2, 20);
    this.camera.lookAt(new THREE.Vector3(0, -2, 0));
    this.controls.target.set(0, -2, 0);

    this.grid = this.initGrid();
    this.face = this.initFace();
    this.rotateFace = false;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 0) {
      this.face.vertex1.hideMesh();
      this.face.vertex2.hideMesh();
      this.face.vertex3.hideMesh();
    }
    else if (this.step === 1) {
      this.face.vertex1.showMesh();
      this.face.vertex2.showMesh();
      this.face.vertex3.showMesh();
      this.face.vertex1.hideLabel();
      this.face.vertex2.hideLabel();
      this.face.vertex3.hideLabel();
    }
    else if (this.step === 2) {
      this.face.vertex1.showLabel();
      this.face.vertex2.showLabel();
      this.face.vertex3.showLabel();
      this.edges.hideMesh();
    }
    else if (this.step === 3) {
      this.rotateFace = false;
      this.rotateBack();
      this.edges.showMesh();
    }
    else if (this.step === 4) {
      this.rotateFace = true;
    }
  }

  initGrid() {
    const gridHelper = new THREE.GridHelper( 100, 100 );
    gridHelper.rotateX(THREE.Math.degToRad(90));
    this.scene.add(gridHelper);
    return gridHelper;
  }

  initFace() {
    const vertPos1 = new THREE.Vector3(0, 5, 0);
    const vertPos2 = new THREE.Vector3(-4, -3, 0);
    const vertPos3 = new THREE.Vector3(4, -3, 0);

    const vertex1 = new Vertex(vertPos1, new THREE.Vector3(0, 7.5, 0));
    const vertex2 = new Vertex(vertPos2, new THREE.Vector3(-5, -3.5, 0));
    const vertex3 = new Vertex(vertPos3, new THREE.Vector3(5, -3.5, 0));

    const edge1 = new Edge(vertPos1, vertPos2);
    const edge2 = new Edge(vertPos2, vertPos3);
    const edge3 = new Edge(vertPos3, vertPos1);

    const mainGroup = new THREE.Group();
    mainGroup.add(
      vertex1.group, vertex2.group, vertex3.group,
      edge1.mesh, edge2.mesh, edge3.mesh
    );

    this.scene.add(mainGroup);

    const showVertices = () => {
      vertex1.showMesh();
      vertex2.showMesh();
      vertex3.showMesh();
    };

    const hideVertices = () => {

    };
    return {
      mainGroup,
      vertex1,
      vertex2,
      vertex3
    };
  }

  initEdges() {
    const edge1 = new Edge(this.face.vertex1.mesh.position, this.face.vertex2.mesh.position);
    this.scene.add(edge1.mesh);
    return edge1;
  }

  rotateBack() {
    const currentRotation = THREE.Math.radToDeg(this.face.mainGroup.rotation.z);
    const backRotation = currentRotation - (currentRotation % 360);
    anime({
      targets: this.face.mainGroup.rotation,
      z: THREE.Math.degToRad(backRotation),
      duration: 2000
    });
  }

  animate() {
    super.animate();
    const delta = this.clock.getDelta();
    if (this.rotateFace) {
      this.face.mainGroup.rotation.z -= delta;
      this.face.vertex1.updateLabel();
      this.face.vertex2.updateLabel();
      this.face.vertex3.updateLabel();
    }
  }
}

class Vertex {
  constructor(meshPosition, labelPosition) {
    this.mesh = this.initMesh(meshPosition);
    this.label = this.initLabel(labelPosition);
    this.group = this.initGroup();
    this.updateLabel();
    this.hideMesh();
  }

  initMesh(position) {
    const geometry = new THREE.SphereGeometry(0.25, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: '#E2336E',
      transparent: true,
      opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    return mesh;
  }

  initLabel(position) {
    const label = new SpriteText2D(' ', {
      align: textAlign.center,
      font: '30px Arial',
      fillStyle: '#FFF'
    });
    label.material.transparent = true;
    label.material.opacity = 0;
    label.position.copy(position);
    label.scale.set(0.025, 0.025, 0.025);
    return label;
  }

  initGroup() {
    const group = new THREE.Group();
    group.add(this.mesh, this.label);
    return group;
  }

  showMesh() {
    anime({
      targets: this.mesh.material,
      opacity: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideMesh() {
    anime({
      targets: this.mesh.material,
      opacity: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  showLabel() {
    anime({
      targets: this.label.material,
      opacity: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideLabel() {
    anime({
      targets: this.label.material,
      opacity: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  updateLabel() {
    const { x, y, z} = this.mesh.getWorldPosition();
    this.label.text = `[${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}]`;
  }
}

class Edge {
  constructor(startPosition, endPosition) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.mesh = this.initMesh();
  }

  initMesh() {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(this.startPosition);
    geometry.vertices.push(this.endPosition);

    const line = new MeshLine();
    line.setGeometry(geometry, () => 0.1);

    const material = new MeshLineMaterial({ transparent: true, opacity: 0 });

    const mesh = new THREE.Mesh(line.geometry, material);

    return mesh;
  }

  showMesh() {
    anime({
      targets: this.mesh.material.uniforms.opacity,
      value: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideMesh() {
    anime({
      targets: this.mesh.material.uniforms.opacity,
      value: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }
}

class Face {
  constructor(vertPos1, vertPos2, vertPos3) {
    this.vertices = this.initVertices(vertPos1, vertPos2, vertPos3);
    this.edges = this.initEdges(vertPos1, vertPos2, vertPos3);
    this.face = this.initFace(vertPos1, vertPos2, vertPos3);
    this.group = initGroup();
  }

  initVertices(vertPos1, vertPos2, vertPos3) {
    const labelPos1 = vertPos1.clone();
    labelPos1.y += 2.5;
    const labelPos2 = vertPos2.clone();
    const labelPos3 = vertPos3.clone();

    const vertex1 = new Vertex(vertPos1, new THREE.Vector3(0, 7.5, 0));
    const vertex2 = new Vertex(vertPos2, new THREE.Vector3(-5, -3.5, 0));
    const vertex3 = new Vertex(vertPos3, new THREE.Vector3(5, -3.5, 0));

    return [vertex1, vertex2, vertex3];
  }
}
