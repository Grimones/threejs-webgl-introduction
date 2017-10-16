export default class Scene {
  constructor(canvas) {
    this.gl = this.initWebGL(canvas);
    this.vsContent = this.getVSContent();
    this.fsContent = this.getFSContent();
    this.vertices = this.fillVertices();
    this.shaderProg = this.initShaders();
    this.vertPositionBuffer = this.initBuffers();
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  initWebGL(canvas) {
    const gl = canvas.getContext('webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    return gl;
  }

  getVSContent() {
    return `
    attribute vec3 Position;
    
    uniform mat4 u_ModelView;
    uniform mat4 u_Persp;
    
    void main(void) {
      gl_Position = u_Persp * u_ModelView * vec4(Position, 1.0);
    }
    `;
  }

  getFSContent() {
    return `
    precision mediump float;

    void main(void) {
      gl_FragColor = vec4(0.886, 0.2, 0.431, 1.0);
    }
    `;
  }

  fillVertices() {
    return new Float32Array([
      -0.5, -0.5, 0.0, // eslint-disable-line
       0.5, -0.5, 0.0, // eslint-disable-line
       0.0,  0.5, 0.0  // eslint-disable-line
    ]);
  }

  initShaders() {
    const frag = this.compileShader(this.fsContent, this.gl.FRAGMENT_SHADER);
    const vert = this.compileShader(this.vsContent, this.gl.VERTEX_SHADER);
    const shaderProg = this.gl.createProgram();
    this.gl.attachShader(shaderProg, vert);
    this.gl.attachShader(shaderProg, frag);
    this.gl.linkProgram(shaderProg);
    if (!this.gl.getProgramParameter(shaderProg, this.gl.LINK_STATUS)) {
      alert('Could not initialise shaders'); // eslint-disable-line no-alert
    }
    this.gl.useProgram(shaderProg);
    shaderProg.positionLocation = this.gl.getAttribLocation(shaderProg, 'Position');
    this.gl.enableVertexAttribArray(shaderProg.positionLocation);

    shaderProg.u_PerspLocation = this.gl.getUniformLocation(shaderProg, 'u_Persp'); // eslint-disable-line camelcase
    shaderProg.u_ModelViewLocation = this.gl.getUniformLocation(shaderProg, 'u_ModelView'); // eslint-disable-line camelcase
    return shaderProg;
  }

  initBuffers() {
    const vertPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertPositionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);
    vertPositionBuffer.itemSize = 3;
    vertPositionBuffer.numItems = 3;
    return vertPositionBuffer;
  }

  compileShader(shaderContent, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, shaderContent);
    this.gl.compileShader(shader);
    return shader;
  }

  createMatrixFromPerspective(fieldOfViewInRadians, aspectRatio, near, far) {
    const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    const rangeInv = 1 / (near - far);

    return [
      f / aspectRatio, 0,   0,                          0, // eslint-disable-line no-multi-spaces
      0,               f,   0,                          0, // eslint-disable-line no-multi-spaces
      0,               0,   (near + far) * rangeInv,    -1, // eslint-disable-line no-multi-spaces
      0,               0,   near * far * rangeInv * 2,   0 // eslint-disable-line no-multi-spaces
    ];
  }

  createMatrix() {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  translateMatrix(out, vec3) {
    const x = vec3[0];
    const y = vec3[1];
    const z = vec3[2];
    out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
    out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
    out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
    out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
  }

  drawScene() {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const pMatrix = this.createMatrixFromPerspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
    const mvMatrix = this.createMatrix();
    this.translateMatrix(mvMatrix, [0.0, 0.0, -4.0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertPositionBuffer);
    this.gl.vertexAttribPointer(this.shaderProg.positionLocation, this.vertPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.uniformMatrix4fv(this.shaderProg.u_PerspLocation, false, pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProg.u_ModelViewLocation, false, mvMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertPositionBuffer.numItems);
  }
}
