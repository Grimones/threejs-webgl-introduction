import * as THREE from 'three';
import BasicScene from './BasicScene';
import { GPUComputationRenderer } from '../shaders/GPUComputationRenderer';
import ParticlesFragmentShader from '../shaders/particlesF';
import ParticlesVertexShader from '../shaders/particlesV';
import PositionFragmentShader from '../shaders/positionF';
import VelocityFragmentShader from '../shaders/velocityF';

console.log('====================================');
console.log(ParticlesFragmentShader);
console.log('====================================');

export default class ShadersPlayground extends BasicScene {
  constructor(canvas, particlesConfig) {
    super(canvas);
    this.particlesConfig = {gpuSize: 512, brushSize: 50, forceMultiplyer: 30, ease: 0.05, drag: 0.8};

    const geometry = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: '#fff', metalness: 0.1, roughness: 1.0 }));
    this.scene.add(mesh);

    const loader = new THREE.FontLoader();
    loader.load( 'assets/helvetiker_bold.typeface.json', font => {
      this.text = this.initText(font);

      this.last = performance.now();
      this.now = 0;
      this.uniforms = this.initUniforms();
      this.shaderMesh = this.initShaderMesh();
      this.gpuRenderer = this.initGpuCompute();

      this.recieverSize = this.particlesConfig.gpuSize * 1.25;

      this.raycastReciever = this.initRaycastReciever();
      this.raycastVector = new THREE.Vector3();
      this.vectorForward = new THREE.Vector3(0, 0, -1);
      this.raycaster = this.initRaycaster();
      this.raycastHelperVector = new THREE.Vector3();
      this.raycastHelper = this.initRaycastHelper();
      this.intersectRay = 0;

      this.fitCameraToParticles(this.canvas.width, this.canvas.height);
      this.fitRaycastRecieverInCamera(this.canvas.width, this.canvas.height);

      this.loaded = true;
    } );
  }

  triangleArea(vectorA, vectorB, vectorC) {

    var vector1 = new THREE.Vector3();
    var vector2 = new THREE.Vector3();


    vector1.subVectors( vectorB, vectorA );
    vector2.subVectors( vectorC, vectorA );
    vector1.cross( vector2 );

    return 0.5 * vector1.length();
  }

  initText(font) {
    const geometry = new THREE.TextGeometry( 'LOLOLO?', {
      font: font,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelSegments: 5
    });
    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(mesh); 
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -400, 0, 0 ) );
    return geometry;
  }

  randomPointsInGeometry( geometry, n ) {

    var face, i,
        faces = geometry.faces,
        vertices = geometry.vertices,
        il = faces.length,
        totalArea = 0,
        cumulativeAreas = [],
        vA, vB, vC;

    // precompute face areas 

    for ( i = 0; i < il; i++ ) {

      face = faces[i];

      vA = vertices[face.a];
      vB = vertices[face.b];
      vC = vertices[face.c];

      face._area = this.triangleArea( vA, vB, vC );

      totalArea += face._area;

      cumulativeAreas[i] = totalArea;

    }

    // binary search cumulative areas array 

    function binarySearchIndices( value ) {

      function binarySearch( start, end ) {

        // return closest larger index 
        // if exact number is not found 

        if ( end < start ) { return start; }

        var mid = start + Math.floor( ( end - start ) / 2 );

        if ( cumulativeAreas[mid] > value ) {

          return binarySearch( start, mid - 1 );

        }
        else if ( cumulativeAreas[mid] < value ) {

          return binarySearch( mid + 1, end );

        }
        else {

          return mid;

        }

      }

      var result = binarySearch( 0, cumulativeAreas.length - 1 );
      return result;

    }

    // pick random face weighted by face area 

    var r, index,
        result = [];

    var stats = {};

    for ( i = 0; i < n; i++ ) {

      r = Math.random() * totalArea;

      index = binarySearchIndices( r );

      result[i] = this.randomPointInFace( faces[index], geometry );

      if ( !stats[index] ) {

        stats[index] = 1;

      }
      else {

        stats[index] += 1;

      }

    }

    return result;

  }

  randomPointInFace( face, geometry ) {

    var vA, vB, vC;

    vA = geometry.vertices[face.a];
    vB = geometry.vertices[face.b];
    vC = geometry.vertices[face.c];

    return this.randomPointInTriangle( vA, vB, vC );

  }

  randomPointInTriangle(vectorA, vectorB, vectorC) {

    var vector = new THREE.Vector3();


    var point = new THREE.Vector3();

    var a = Math.random();
    var b = Math.random();

    if ( ( a + b ) > 1 ) {

      a = 1 - a;
      b = 1 - b;

    }

    var c = 1 - a - b;

    point.copy( vectorA );
    point.multiplyScalar( a );

    vector.copy( vectorB );
    vector.multiplyScalar( b );

    point.add( vector );

    vector.copy( vectorC );
    vector.multiplyScalar( c );

    point.add( vector );

    return point;


  }
  fillPositionTextureText( texture, gpuSize ) {
    const imageData = texture.image.data;

    const points = this.randomPointsInGeometry( this.text, imageData.length / 3 );

    for (let i = 0; i < imageData.length / 3; i++) {
      const pi = i * 4;
      imageData[pi + 0] = points[i].x;
      imageData[pi + 1] = points[i].y;
      imageData[pi + 2] = points[i].x;
      imageData[pi + 3] = points[i].y;
    }

    // const gpuSizeHalf = gpuSize / 2; 
    // for (let y = 0; y < gpuSize; y++) { 
    //   for (let x = 0; x < gpuSize; x++) { 
    //     const pi = ((gpuSize * y) + x) * 4; 
    //     const xPos = (x - gpuSizeHalf); 
    //     const yPos = (y - gpuSizeHalf); 
    //     imageData[pi + 0] = xPos; 
    //     imageData[pi + 1] = yPos; 
    //     imageData[pi + 2] = xPos; 
    //     imageData[pi + 3] = yPos; 
    //   } 
    // } 
  }

  initRaycastReciever() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  initRaycaster() {
    return new THREE.Raycaster();
  }

  initRaycastHelper() {
    const geometry = new THREE.SphereGeometry(this.particlesConfig.brushSize, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ff0000'),
      transparent: true,
      opacity: 0.4
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = this.particlesConfig.showPointer;
    mesh.position.set(10000, 10000, 0);
    this.scene.add(mesh);
    return mesh;
  }

  initUniforms() {
    return {
      show: {
        type: 'f',
        value: 1.0
      },
      particleSize: {
        type: 'f',
        value: this.particlesConfig.particleSize
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(this.canvas.width, this.canvas.height)
      },
      particlesTexture: {
        value: THREE.ImageUtils.loadTexture('assets/images/herrenshatz-particles.png')
      },
      texturePosition: {
        value: null
      },
      textureVelocity: {
        value: null
      }
    };
  }

  initShaderMesh() {
    const width = this.particlesConfig.gpuSize;
    const height = this.particlesConfig.gpuSize;
    const l = width * height;
    const vertices = new Float32Array( l * 3 );
    for ( let i = 0; i < l; i++ ) {
      const i3 = i * 3;
      vertices[i3] = ( i % width ) / width;
      vertices[i3 + 1] = ( i / width ) / height;
    }

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: ParticlesVertexShader,
      fragmentShader: ParticlesFragmentShader
    });

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const mesh = new THREE.Points(geometry, material);
    this.scene.add(mesh);
    return mesh;
  }

  initGpuCompute() {
    const { gpuSize, brushSize, forceMultiplyer, drag, ease } = this.particlesConfig;
    const gpuCompute = new GPUComputationRenderer(gpuSize, gpuSize, this.renderer);
    const dtPosition = gpuCompute.createTexture();
    const dtVelocity = gpuCompute.createTexture();

    this.fillPositionTextureText(dtPosition, gpuSize);
    this.fillVelocityTexture(dtVelocity );

    const velocityVariable = gpuCompute.addVariable('textureVelocity', VelocityFragmentShader, dtVelocity);
    const positionVariable = gpuCompute.addVariable('texturePosition', PositionFragmentShader, dtPosition);

    gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

    const positionUniforms = positionVariable.material.uniforms;
    const velocityUniforms = velocityVariable.material.uniforms;

    positionUniforms.time = { value: 0.0 };
    positionUniforms.delta = { value: 0.0 };
    positionVariable.wrapS = THREE.RepeatWrapping;
    positionVariable.wrapT = THREE.RepeatWrapping;

    velocityUniforms.time = { value: 1.0 };
    velocityUniforms.delta = { value: 0.0 };
    velocityUniforms.blobCenter = { value: new THREE.Vector2() };
    velocityUniforms.brushSize = { value: brushSize };
    velocityUniforms.forceMultiplyer = { value: forceMultiplyer };
    velocityUniforms.drag = { value: drag };
    velocityUniforms.ease = { value: ease };
    velocityVariable.wrapS = THREE.RepeatWrapping;
    velocityVariable.wrapT = THREE.RepeatWrapping;

    const error = gpuCompute.init();
    if ( error !== null ) {
      console.error( error ); // eslint-disable-line
    }
    console.log('====================================');
    console.log(gpuCompute, positionUniforms, positionVariable, velocityUniforms, velocityVariable, dtPosition);
    console.log('====================================');

    return { gpuCompute, positionUniforms, positionVariable, velocityUniforms, velocityVariable, dtPosition };
  }

  fillPositionTexture( texture, gpuSize ) {
    const imageData = texture.image.data;
    const gpuSizeHalf = gpuSize / 2;
    for (let y = 0; y < gpuSize; y++) {
      for (let x = 0; x < gpuSize; x++) {
        const pi = ((gpuSize * y) + x) * 4;
        const xPos = (x - gpuSizeHalf);
        const yPos = (y - gpuSizeHalf);
        imageData[pi + 0] = xPos;
        imageData[pi + 1] = yPos;
        imageData[pi + 2] = xPos;
        imageData[pi + 3] = yPos;
      }
    }
  }

  fillVelocityTexture( texture ) {
    const imageData = texture.image.data;
    for ( let i = 0; i < imageData.length; i += 4 ) {
      imageData[i + 0] = 0.01;
      imageData[i + 1] = 0.01;
      imageData[i + 2] = 0.01;
      imageData[i + 3] = 0.01;
    }
  }

  fitRaycastRecieverInCamera(viewportWidth, viewportHeight) {
    const height = 2 * Math.tan(Math.PI * this.camera.fov / 360) * this.camera.position.z;
    const aspect = viewportWidth / viewportHeight;
    const width = height * aspect;
    const geometry = new THREE.PlaneGeometry(width * 1.1, height * 1.1);
    this.raycastReciever.geometry.dispose();
    this.raycastReciever.geometry = geometry;
  }

  fitCameraToParticles(width, height) {
    const aspect = width > height ? width / height : 1;
    const distance = (this.particlesConfig.gpuSize / 2) / aspect / Math.tan(Math.PI * this.camera.fov / 360);
    this.camera.position.setZ(distance);
  }

  resizeRenderer(viewport) {
    const width = viewport.width ? viewport.width : window.innerWidth;
    const height = viewport.height ? viewport.height : window.innerHeight;
    super.resizeRenderer({ width, height });
    this.fitCameraToParticles(width, height);
    this.fitRaycastRecieverInCamera(width, height);
    this.uniforms.resolution.value.set(width / 2, height / 2);
  }

  resizeRaycastHelper(size) {
    this.raycastHelper.geometry.dispose();
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    this.raycastHelper.geometry = geometry;
  }

  raycast(x, y) {
    this.raycastVector.set(x, y, 5);
    this.raycaster.set(
      this.raycastVector,
      this.vectorForward
    );
    const intersects = this.raycaster.intersectObject(this.raycastReciever);
    if ( intersects.length > 0 ) {
      if (this.intersectRay < 2) {
        this.intersectRay += 1;
      }
      this.raycastHelperVector.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    }
    else if (this.isTracked) {
      this.raycastHelperVector.set(1, 1, 0);
    }
    else {
      this.intersectRay = 0;
      this.raycastHelperVector.set(this.particlesConfig.gpuSize * 2, 0, 0);
    }
  }

  animate() {
    if (this.loaded) {
      const { gpuCompute, positionUniforms, positionVariable, velocityUniforms, velocityVariable } = this.gpuRenderer;

      const clockDelta = this.clock.getDelta();
      this.now = performance.now();
      if (this.tutorialHands && this.tutorialHands.loaded) {
        this.tutorialHands.updateAnimationMixers(clockDelta);
      }
      let delta = (this.now - this.last) / 1000;
      if (delta > 1) {
        delta = 1; // safety cap on large deltas
      }
      this.last = this.now;

      if (this.computeParticles) {
        positionUniforms.time.value = this.now;
        positionUniforms.delta.value = delta * 2;

        velocityUniforms.time.value = this.now;
        velocityUniforms.delta.value = delta * 2;

        if (this.intersectRay > 1) {
          this.raycastHelper.position.lerp(this.raycastHelperVector, delta * 2);
        }
        else {
          this.raycastHelper.position.set(
            this.raycastHelperVector.x,
            this.raycastHelperVector.y,
            this.raycastHelperVector.z
          );
        }

        velocityUniforms.blobCenter.value.set(
          this.raycastHelper.position.x,
          this.raycastHelper.position.y
        );

        gpuCompute.compute();
        this.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
        this.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;
      }

      super.animate();
    }
    console.log('====================================');
    console.log(this.loaded);
    console.log('====================================');
  }

  renderFrame() {
    super.renderFrame();
  }

  dispose() {
    this.raycastHelper.geometry.dispose();
    this.raycastHelper.geometry = null;
    this.raycastHelper.material.dispose();
    this.raycastHelper.material = null;
    this.raycastHelper = null;
    this.raycastReciever.geometry.dispose();
    this.raycastReciever.geometry = null;
    this.raycastReciever.material.dispose();
    this.raycastReciever.material = null;
    this.raycastReciever = null;
    this.shaderMesh.geometry.dispose();
    this.shaderMesh.geometry = null;
    this.shaderMesh.material.dispose();
    this.shaderMesh.material = null;
    this.shaderMesh = null;

    this.uniforms = null;
    const { gpuCompute, positionVariable, velocityVariable } = this.gpuRenderer;
    this.renderer.clearTarget(gpuCompute.getCurrentRenderTarget(positionVariable), true, true, true);
    gpuCompute.getCurrentRenderTarget(positionVariable).texture.dispose();
    gpuCompute.getCurrentRenderTarget(positionVariable).dispose();
    this.renderer.clearTarget(gpuCompute.getCurrentRenderTarget(velocityVariable), true, true, true);
    gpuCompute.getCurrentRenderTarget(velocityVariable).texture.dispose();
    gpuCompute.getCurrentRenderTarget(velocityVariable).dispose();
    this.gpuRenderer.velocityUniforms = null;
    this.gpuRenderer.positionUniforms = null;
    this.gpuRenderer.gpuCompute = null;

    this.particlesConfig = null;
    this.kinectDepthConfig = null;
    this.recieverSize = null;
    this.depthWidth = null;
    this.depthHeight = null;
    this.depthOffsetX = null;
    this.depthOffsetY = null;
    this.mapDepthToRecieverWidth = null;
    this.mapDepthToRecieverHeight = null;
    this.raycastVector = null;
    this.vectorForward = null;
    this.raycaster = null;
    super.dispose();
  }
}
