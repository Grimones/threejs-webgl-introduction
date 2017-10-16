import * as THREE from 'three';
import { SpriteText2D, textAlign } from 'three-text2d';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import OrbitControls from '../utils/OrbitControls';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, false);
    this.grid = this.initGrid();
    this.face = this.initFace();

    this.RTCamera = this.initRTCamera();
    this.RTScene = this.initRTScene();
    this.RTTexture = this.initRTTexture();
    this.RTMesh = this.initRTMesh();
    this.RTFace = this.initRTFace();
    this.RTGrid = this.initRTGrid();

    this.rotateFace = false;
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 0) {
      this.face.hideVertices();
    }
    else if (this.step === 1) {
      this.face.showVertices();
      this.face.hidePositionLabels();
    }
    else if (this.step === 2) {
      this.face.showPositionLabels();
      this.face.hideEdges();
    }
    else if (this.step === 3) {
      this.face.showEdges();
      this.face.hideMesh();
    }
    else if (this.step === 4) {
      this.face.showMesh();
      this.rotateFace = false;
      this.rotateBack();
    }
    else if (this.step === 5) {
      this.rotateFace = true;
      this.showGrid();
      this.face.showPositionLabels();
      this.face.showEdges();
      this.face.showVertices();
    }
    else if (this.step === 6) {
      this.face.hidePositionLabels();
      this.face.hideEdges();
      this.face.hideVertices();
      this.face.changeColor(0.886, 0.2, 0.431);
      anime({
        targets: this.camera.position,
        z: 15,
        easing: 'easeInOutQuad',
        duration: 700
      });
      this.hideGrid();
      this.hideRTGrid();
    }
    else if (this.step === 7) {
      this.showRTGrid();
      this.hideRTMesh();
    }
    else if (this.step === 8) {
      this.showRTMesh();
      this.animateCameraBack();
    }
    else if (this.step === 9) {
      this.animateCamera();
      this.rotateFace = true;
    }
    else if (this.step === 10) {
      this.rotateFace = false;
      this.rotateBack();
    }
  }

  initGrid() {
    const gridHelper = new THREE.GridHelper( 100, 100 );
    gridHelper.rotateX(THREE.Math.degToRad(90));
    gridHelper.material.transparent = true;
    gridHelper.material.depthTest = false;
    this.scene.add(gridHelper);
    return gridHelper;
  }

  initFace() {
    const vertPos1 = new THREE.Vector3(0, 5, 0);
    const vertPos2 = new THREE.Vector3(-4, -3, 0);
    const vertPos3 = new THREE.Vector3(4, -3, 0);

    const face = new Face(vertPos1, vertPos2, vertPos3);
    this.scene.add(face.group);

    return face;
  }

  initRTFace() {
    const vertPos1 = new THREE.Vector3(0, 5, 0);
    const vertPos2 = new THREE.Vector3(-4, -3, 0);
    const vertPos3 = new THREE.Vector3(4, -3, 0);

    const vecForward = new THREE.Vector3().setZ(1);

    const geometry = new THREE.Geometry();
    geometry.vertices.push(vertPos1);
    geometry.vertices.push(vertPos2);
    geometry.vertices.push(vertPos3);
    geometry.faces.push(new THREE.Face3(0, 1, 2, vecForward));

    const material = new THREE.MeshBasicMaterial({ color: '#ccc' });

    const mesh = new THREE.Mesh(geometry, material);
    this.RTScene.add(mesh);
    return mesh;
  }

  initRTCamera() {
    const camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 1, 10000);
    camera.position.set(0, -2, 20);
    camera.lookAt(new THREE.Vector3(0, -2, 0));
    return camera;
  }

  initRTScene() {
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1));
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    // const mesh = new THREE.Mesh(new THREE.SphereGeometry(10, 16, 16), new THREE.MeshBasicMaterial());
    // scene.add(mesh);
    return scene;
  }

  initRTTexture() {
    return new THREE.WebGLRenderTarget(
      64,
      64,
      {
        anisotropy: 0,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
      }
    );

  }

  initRTMesh() {
    const size = 23.5;
    const geometry = new THREE.PlaneGeometry(size * this.camera.aspect, size);
    const material = new THREE.MeshBasicMaterial({
      alphaMap: this.RTTexture.texture,
      map: this.RTTexture.texture,
      depthTest: false,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    material.needsUpdate = true;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.setZ(0.2);
    mesh.position.setY(-2);
    // mesh.visible = false;
    this.scene.add(mesh);
    return mesh;
  }

  initRTGrid() {
    const gridHelper = new THREE.GridHelper( 100, 240 );
    gridHelper.rotateX(THREE.Math.degToRad(90));
    gridHelper.translateY(0.21);
    gridHelper.material.transparent = true;
    gridHelper.material.depthTest = false;
    gridHelper.material.opacity = 0;
    this.scene.add(gridHelper);
    return gridHelper;
  }

  showRTMesh() {
    anime({
      targets: this.RTMesh.material,
      opacity: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideRTMesh() {
    anime({
      targets: this.RTMesh.material,
      opacity: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideGrid() {
    anime({
      targets: this.grid.material,
      opacity: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  showGrid() {
    anime({
      targets: this.grid.material,
      opacity: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  hideRTGrid() {
    anime({
      targets: this.RTGrid.material,
      opacity: 0,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  showRTGrid() {
    anime({
      targets: this.RTGrid.material,
      opacity: 1,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  animateCamera() {
    anime({
      targets: this.RTMesh.position,
      z: 5,
      easing: 'easeInOutQuad',
      duration: 700
    });
    anime({
      targets: this.RTGrid.position,
      z: 5.01,
      easing: 'easeInOutQuad',
      duration: 700
    });
    anime({
      targets: this.camera.position,
      x: 10,
      z: 15,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }

  animateCameraBack() {

  }

  rotateBack() {
    const currentRotation = THREE.Math.radToDeg(this.face.group.rotation.z);
    const backRotation = currentRotation - (currentRotation % 360);
    anime({
      targets: this.face.group.rotation,
      z: THREE.Math.degToRad(backRotation),
      duration: 2000,
      update: () => this.face.updatePositionLabels()
    });
    anime({
      targets: this.RTFace.rotation,
      z: THREE.Math.degToRad(backRotation),
      duration: 2000
    });
  }

  animate() {
    super.animate();
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    const delta = this.clock.getDelta();
    if (this.rotateFace) {
      this.face.group.rotation.z -= delta;
      this.RTFace.rotation.z -= delta;
      this.face.updatePositionLabels();
    }
  }

  renderFrame() {
    super.renderFrame();
    this.renderer.render(this.RTScene, this.RTCamera, this.RTTexture, true);
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
    this.mesh = this.initMesh(vertPos1, vertPos2, vertPos3);
    this.group = this.initGroup();
  }

  initVertices(vertPos1, vertPos2, vertPos3) {
    const labelPos1 = vertPos1.clone();
    labelPos1.y += 2.5;
    const labelPos2 = vertPos2.clone();
    labelPos2.x -= 1;
    labelPos2.y -= 1.5;
    const labelPos3 = vertPos3.clone();
    labelPos3.x += 1;
    labelPos3.y -= 1.5;

    const vertex1 = new Vertex(vertPos1, labelPos1);
    const vertex2 = new Vertex(vertPos2, labelPos2);
    const vertex3 = new Vertex(vertPos3, labelPos3);

    return [vertex1, vertex2, vertex3];
  }

  initEdges(vertPos1, vertPos2, vertPos3) {
    const edge1 = new Edge(vertPos1, vertPos2);
    const edge2 = new Edge(vertPos2, vertPos3);
    const edge3 = new Edge(vertPos3, vertPos1);

    return [edge1, edge2, edge3];
  }

  initMesh(vertPos1, vertPos2, vertPos3) {
    const vecForward = new THREE.Vector3().setZ(1);

    const geometry = new THREE.Geometry();
    geometry.vertices.push(vertPos1);
    geometry.vertices.push(vertPos2);
    geometry.vertices.push(vertPos3);
    geometry.faces.push(new THREE.Face3(0, 1, 2, vecForward));

    const material = new THREE.MeshBasicMaterial({ depthTest: false, color: '#FFF', transparent: true, opacity: 0 });

    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  initGroup() {
    const group = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      group.add(this.vertices[i].group, this.edges[i].mesh);
    }
    group.add(this.mesh);

    return group;
  }

  showVertices() {
    for (let i = 0; i < 3; i++) {
      this.vertices[i].showMesh();
    }
  }

  hideVertices() {
    for (let i = 0; i < 3; i++) {
      this.vertices[i].hideMesh();
    }
  }

  showPositionLabels() {
    for (let i = 0; i < 3; i++) {
      this.vertices[i].showLabel();
    }
  }

  hidePositionLabels() {
    for (let i = 0; i < 3; i++) {
      this.vertices[i].hideLabel();
    }
  }

  updatePositionLabels() {
    for (let i = 0; i < 3; i++) {
      this.vertices[i].updateLabel();
    }
  }

  showEdges() {
    for (let i = 0; i < 3; i++) {
      this.edges[i].showMesh();
    }
  }

  hideEdges() {
    for (let i = 0; i < 3; i++) {
      this.edges[i].hideMesh();
    }
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

  changeColor(r, g, b) {
    anime({
      targets: this.mesh.material.color,
      r: r,
      g: g,
      b: b,
      easing: 'easeInOutQuad',
      duration: 700
    });
  }
}
