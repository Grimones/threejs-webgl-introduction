import * as THREE from 'three';
import PMREMCubeUVPacker from '../utils/PMREMCubeUVPacker';
import PMREMGenerator from '../utils/PMREMGenerator';
import BasicScene from './BasicScene';
import anime from 'animejs';

export default class Scene extends BasicScene {
  constructor(canvas, showStats, useControls) {
    super(canvas, showStats, true);

    this.scene.background = new THREE.Color('#2D2D2D');
    this.lights.keyLight.intensity *= 1.5;
    this.lights.fillLight.intensity *= 1.5;
    this.lights.rimLight.intensity *= 1.5;

    this.camera.position.setZ(15);
    this.camera.position.setY(3);
    this.lookAtVec = new THREE.Vector3(0, 0, 0);

    this.commonColor = '#E2336E';

    this.initSuzanne().then(mesh => {
      this.suzanne = mesh;
    });
    this.loadTexture('assets/albedo.png').then(texture => {
      this.albedo = texture;
    });
    this.loadTexture('assets/roughness.png').then(texture => {
      this.roughness = texture;
    });
    this.loadTexture('assets/metalness.png').then(texture => {
      this.metalness = texture;
    });
    this.loadTexture('assets/normal.png').then(texture => {
      this.normal = texture;
    });
    this.loadTexture('assets/alpha.png').then(texture => {
      this.alpha = texture;
    });
    this.moveSuzanne = false;
    this.physical = this.initMeshPhysicalMaterial();
    this.grid = this.initGrid();
  }

  loadTexture(path) {
    return new Promise(resolve => {
      const loader = new THREE.TextureLoader();
      loader.load(path, texture => {
        resolve(texture);
      });
    });
  }

  initGrid() {
    const grid = new THREE.GridHelper(5000, 2500, '#262626', '#4d4d4d');
    grid.position.setY(-5);
    grid.material.transparent = true;
    grid.material.opacity = 0;
    this.scene.add(grid);
    return grid;
  }

  initMeshPhysicalMaterial() {
    const material = new THREE.MeshPhysicalMaterial({ color: '#444', metalness: 0.5, roughness: 0.8, clearCoat: 0, clearCoatRoughness: 0 });
    const mesh = this.initSphere(material, true, true);
    const vertexNormalsHelper = new THREE.VertexNormalsHelper(mesh, 1, '#ff0000', 1);
    const faceNormalsHelper = new THREE.FaceNormalsHelper(mesh, 1, '#0000ff', 1);
    const wireframeGeometry = new THREE.WireframeGeometry(mesh.geometry);
    const wireframe = new THREE.LineSegments(wireframeGeometry);
    wireframe.scale.set(1.001, 1.001, 1.001);
    wireframe.material.color = new THREE.Color('#fff');
    wireframe.material.opacity = 0.25;
    wireframe.material.transparent = true;
    wireframe.visible = false;
    vertexNormalsHelper.visible = false;
    faceNormalsHelper.visible = false;
    this.scene.add(mesh, faceNormalsHelper, vertexNormalsHelper, wireframe);
    mesh.position.set(0, 0, 0);
    return { material, mesh, faceNormalsHelper, vertexNormalsHelper, wireframe };
  }

  initSphere(material, reflections, pmrem) {
    const geometry = new THREE.OctahedronGeometry(4, 2);
    const mesh = new THREE.Mesh(geometry, material);
    if (reflections) {
      const cubeCamera = this.initCubeCamera();
      if (pmrem) {
        const pmrem = this.initPMREM(cubeCamera);
        mesh.pmrem = pmrem;
        material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
      }
      else {
        material.envMap = cubeCamera.renderTarget.texture;
      }
      mesh.add(cubeCamera);
      mesh.cubeCamera = cubeCamera;
    }
    return mesh;
  }

  initSuzanne() {
    const loader = new THREE.JSONLoader();
    return new Promise(resolve => {
      loader.load('assets/suzanne.json', geometry => {
        const material = new THREE.MeshStandardMaterial({ color: this.commonColor, metalness: 1, roughness: 0.5 });
        const mesh = new THREE.Mesh(geometry, material);
        const cubeCamera = this.initCubeCamera();
        const pmrem = this.initPMREM(cubeCamera);
        mesh.pmrem = pmrem;
        material.envMap = pmrem.packer.CubeUVRenderTarget.texture;
        mesh.add(cubeCamera);
        mesh.cubeCamera = cubeCamera;
        mesh.scale.multiplyScalar(0.5);
        mesh.position.setX(20);
        this.scene.add(mesh);
        resolve(mesh);
      });
    });
  }

  initCubeCamera() {
    const cubeCamera = new THREE.CubeCamera( 1, 2000, 1024 );
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.anisotropy = 0;
    return cubeCamera;
  }

  initPMREM(cubeCamera) {
    const pmremGenerator = new PMREMGenerator(cubeCamera.renderTarget.texture);
    const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);

    return {
      generator: pmremGenerator,
      packer: pmremCubeUVPacker
    };
  }

  setStep(step) {
    super.setStep(step);
    if (this.step === 1) {
      this.physical.material.flatShading = true;
      this.physical.material.needsUpdate = true;
    }
    if (this.step === 2) {
      this.physical.wireframe.visible = true;
      this.physical.faceNormalsHelper.visible = true;
    }
    if (this.step === 3) {
      this.physical.material.flatShading = false;
      this.physical.material.needsUpdate = true;
      this.physical.faceNormalsHelper.visible = false;
      this.physical.vertexNormalsHelper.visible = true;
    }
    if (this.step === 4) {
      this.physical.material.flatShading = true;
      this.physical.material.needsUpdate = true;
      this.physical.wireframe.visible = false;
      this.physical.vertexNormalsHelper.visible = false;
    }
    if (this.step === 5) {
      this.physical.faceNormalsHelper.visible = false;
      this.physical.vertexNormalsHelper.visible = false;
      anime({
        targets: this.physical.material.color,
        r: 0.886,
        g: 0.2,
        b: 0.431,
        easing: 'easeInOutQuad',
        duration: 700
      });
    }
    if (this.step === 6) {
      this.physical.material.wireframe = true;
    }
    if (this.step === 7) {
      this.physical.material.wireframe = false;
    }
    if (this.step === 7) {
      this.physical.material.wireframe = false;
    }
    if (this.step === 8) {
      this.physical.material.transparent = true;
      anime({
        targets: this.physical.material,
        opacity: 0.2,
        easing: 'easeInOutQuad',
        duration: 700
      });
      anime({
        targets: this.grid.material,
        opacity: 1,
        easing: 'easeInOutQuad',
        duration: 1500
      });
    }
    if (this.step === 9) {
      this.physical.material.transparent = true;
      anime({
        targets: this.physical.material,
        opacity: 1,
        easing: 'easeInOutQuad',
        duration: 700,
        complete: () => { this.physical.material.transparent = false; }
      });
    }
    if (this.step === 10) {
      anime({
        targets: this.physical.material,
        metalness: 1,
        roughness: 0,
        easing: 'easeInOutQuad',
        duration: 700
      });
      anime({
        targets: this.camera.position,
        y: 10,
        z: 40,
        easing: 'easeInOutQuad',
        duration: 1700
      });
      this.moveSuzanne = true;
    }
    if (this.step === 11) {
      this.physical.material.flatShading = false;
      this.physical.material.needsUpdate = true;
    }
    if (this.step === 12) {
      anime({
        targets: this.camera.position,
        y: 5,
        z: 20,
        easing: 'easeInOutQuad',
        duration: 1700
      });
      anime({
        targets: this.grid.material,
        opacity: 0,
        easing: 'easeInOutQuad',
        duration: 1500
      });
    }
    if (this.step === 13) {
      anime({
        targets: this.physical.material,
        metalness: 1,
        roughness: 1,
        easing: 'easeInOutQuad',
        duration: 2000
      });
      this.moveSuzanne = true;
    }
    if (this.step === 14) {
      anime({
        targets: this.physical.material,
        metalness: 1,
        roughness: 0,
        easing: 'easeInOutQuad',
        duration: 2000
      });
      this.moveSuzanne = true;
    }
    if (this.step === 15) {
      anime({
        targets: this.physical.material,
        clearCoat: 1,
        easing: 'easeInOutQuad',
        duration: 2000
      });
    }
    if (this.step === 16) {
      anime({
        targets: this.physical.material,
        clearCoatRoughness: 1,
        easing: 'easeInOutQuad',
        duration: 2000
      });
    }
    if (this.step === 17) {
      anime({
        targets: this.physical.material,
        roughness: 0.8,
        clearCoatRoughness: 0.25,
        easing: 'easeInOutQuad',
        duration: 3000
      });
    }
    if (this.step === 18) {
      anime({
        targets: this.physical.material,
        clearCoat: 0,
        easing: 'easeInOutQuad',
        duration: 3000
      });
    }
    if (this.step === 19) {
      anime({
        targets: this.physical.material,
        clearCoat: 1,
        easing: 'easeInOutQuad',
        duration: 3000
      });
    }
    if (this.step === 20) {
      this.physical.mesh.geometry.dispose();
      const geometry = new THREE.SphereGeometry(4, 32, 32);
      this.physical.mesh.geometry = geometry;
    }
    if (this.step === 21) {
      anime({
        targets: this.physical.material,
        clearCoat: 0,
        metalness: 0,
        roughness: 1,
        easing: 'easeInOutQuad',
        duration: 3000,
        complete: () => {
          this.physical.material.map = this.albedo;
          this.physical.material.needsUpdate = true;
        }
      });
      anime({
        targets: this.physical.material.color,
        r: 1,
        g: 1,
        b: 1,
        easing: 'easeInOutQuad',
        duration: 3000
      });
    }
    if (this.step === 22) {
      anime({
        targets: this.physical.material,
        metalness: 1,
        roughness: 1,
        clearCoat: 1,
        easing: 'easeInOutQuad',
        duration: 3000,
        complete: () => {
          this.physical.material.roughnessMap = this.roughness;
          this.physical.material.needsUpdate = true;
        }
      });
    }
    if (this.step === 23) {
      this.physical.material.metalnessMap = this.metalness;
      this.physical.material.needsUpdate = true;
    }
    if (this.step === 24) {
      this.physical.material.normalMap = this.normal;
      this.physical.material.needsUpdate = true;
    }
    if (this.step === 25) {
      this.scene.background = new THREE.Color('#ccc');
    }
    if (this.step === 26) {
      this.physical.material.alphaMap = this.alpha;
      this.physical.material.transparent = true;
      this.physical.material.needsUpdate = true;
    }
  }

  animate() {
    this.camera.lookAt(this.lookAtVec);
    const delta = this.clock.getDelta();
    if (this.suzanne && this.moveSuzanne) {
      const elapsedTime = this.clock.getElapsedTime();
      this.suzanne.lookAt(this.physical.mesh.position);
      this.suzanne.rotation.z -= elapsedTime / 2;
      this.suzanne.position.x = 20 * Math.cos( elapsedTime);
      this.suzanne.position.z = 20 * Math.sin( elapsedTime);
    }
    super.animate();
  }

  updateReflections(mesh) {
    mesh.visible = false;
    mesh.cubeCamera.update(this.renderer, this.scene);
    if (mesh.pmrem) {
      mesh.pmrem.generator.update(this.renderer);
      mesh.pmrem.packer.update(this.renderer);
    }
    mesh.visible = true;
  }

  renderFrame() {
    if (this.suzanne) {
      this.updateReflections(this.suzanne);
    }
    this.updateReflections(this.physical.mesh);
    super.renderFrame();
  }

  dispose() {
    super.dispose();
  }
}
