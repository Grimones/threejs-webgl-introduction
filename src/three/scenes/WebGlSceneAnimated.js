export default class Scene {
  constructor(canvas) {
    this.gl = this.initWebGL(canvas);
    this.vsContent = this.getVSContent();
    this.fsContent = this.getFSContent();
    this.vertices = this.fillVertices();
    this.shaderProg = this.initShaders();
    this.vertPositionBuffer = this.initBuffers();
    this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
    this.then = 0;
    this.rotation = 0;
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

  rotateMatrix(out, a, rad, axis) {
    let x = axis[0], y = axis[1], z = axis[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    }
    console.log('====================================');
    console.log(out);
    console.log('====================================');
    return out;
  }

  drawScene(delta) {
    this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    const pMatrix = this.createMatrixFromPerspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0);
    const mvMatrix = this.createMatrix();
    this.translateMatrix(mvMatrix, [0.0, 0.0, -4.0]);
    this.rotateMatrix(mvMatrix, mvMatrix, this.rotation, [0, 0, 1]);
    this.gl.vertexAttribPointer(this.shaderProg.positionLocation, this.vertPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
    this.gl.uniformMatrix4fv(this.shaderProg.u_PerspLocation, false, pMatrix);
    this.gl.uniformMatrix4fv(this.shaderProg.u_ModelViewLocation, false, mvMatrix);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertPositionBuffer.numItems);
    this.rotation += delta;
  }

  render = time => {
    const now = time * 0.001;
    const delta = now - this.then;
    this.then = now;

    this.drawScene(delta || 0); // prevent of passing NaN on first frame
    requestAnimationFrame(this.render);
  }
}
