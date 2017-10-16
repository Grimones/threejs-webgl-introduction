export const code = `
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
    return \`
    attribute vec3 Position;
    
    uniform mat4 u_ModelView;
    uniform mat4 u_Persp;
    
    void main(void) {
      gl_Position = u_Persp * u_ModelView * vec4(Position, 1.0);
    }
    \`;
  }

  getFSContent() {
    return \`
    precision mediump float;

    void main(void) {
      gl_FragColor = vec4(0.886, 0.2, 0.431, 1.0);
    }
    \`;
  }

  fillVertices() {
    return new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.0,  0.5, 0.0 
    ]);
  }

  initShaders() {
    const vs = this.compileShader(this.vsContent, this.gl.VERTEX_SHADER);
    const fs = this.compileShader(this.fsContent, this.gl.FRAGMENT_SHADER);
    const shaderProg = this.gl.createProgram();
    this.gl.attachShader(shaderProg, vs);
    this.gl.attachShader(shaderProg, fs);
    this.gl.linkProgram(shaderProg);
    if (!this.gl.getProgramParameter(shaderProg, this.gl.LINK_STATUS)) {
      alert('Could not initialise shaders');
    }
    this.gl.useProgram(shaderProg);
    shaderProg.positionLocation = 
      this.gl.getAttribLocation(shaderProg, 'Position');
    this.gl.enableVertexAttribArray(shaderProg.positionLocation);

    shaderProg.u_PerspLocation = 
      this.gl.getUniformLocation(shaderProg, 'u_Persp');
    shaderProg.u_ModelViewLocation = 
      this.gl.getUniformLocation(shaderProg, 'u_ModelView');
    return shaderProg;
  }

  initBuffers() {
    const vertPositionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertPositionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER, 
      this.vertices, 
      this.gl.STATIC_DRAW
    );
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

  createMatrixFromPerspective(FovInRadians, aspectRatio, near, far) {
    const f = 1.0 / Math.tan(FovInRadians / 2);
    const rangeInv = 1 / (near - far);

    return [
      f / aspectRatio, 0,   0,                          0,
      0,               f,   0,                          0,
      0,               0,   (near + far) * rangeInv,    -1,
      0,               0,   near * far * rangeInv * 2,   0
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
    const pMatrix = this.createMatrixFromPerspective(
      45, 
      this.gl.viewportWidth / this.gl.viewportHeight, 
      0.1, 
      100.0
    );
    const mvMatrix = this.createMatrix();
    this.translateMatrix(mvMatrix, [0.0, 0.0, -4.0]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertPositionBuffer);
    this.gl.vertexAttribPointer(
      this.shaderProg.positionLocation, 
      this.vertPositionBuffer.itemSize, 
      this.gl.FLOAT, 
      false, 
      0, 
      0
    );
    this.gl.uniformMatrix4fv(
      this.shaderProg.u_PerspLocation, 
      false, 
      pMatrix
    );
    this.gl.uniformMatrix4fv(
      this.shaderProg.u_ModelViewLocation, 
      false, 
      mvMatrix
    );
    this.gl.drawArrays(
      this.gl.TRIANGLES, 
      0, 
      this.vertPositionBuffer.numItems
    );
  }
}
`;

export const ranges = [
  { loc: [2, 12], title: 'Инициализация' },
  { loc: [3, 4], title: 'Инициализация WebGL' },
  { loc: [13, 20], title: 'Инициализация WebGL' },
  { loc: [14, 15] },
  { loc: [15, 17] },
  { loc: [17, 18] },
  { loc: [4, 5], title: 'Вертексный шейдер'},
  { loc: [20, 32], title: 'Вертексный шейдер'},
  { loc: [22, 23] },
  { loc: [24, 25] },
  { loc: [25, 26] },
  { loc: [27, 30] },
  { loc: [28, 29] },
  { loc: [5, 6], title: 'Фрагментный шейдер'},
  { loc: [33, 42], title: 'Фрагментный шейдер'},
  { loc: [35, 36] },
  { loc: [37, 40] },
  { loc: [38, 39] },
  { loc: [6, 7], title: 'Заполнение вертексов'},
  { loc: [43, 50], title: 'Заполнение вертексов'},
  { loc: [7, 8], title: 'Создание шейдерной программы'},
  { loc: [51, 71], title: 'Создание шейдерной программы'},
  { loc: [52, 54] },
  { loc: [86, 92] },
  { loc: [87, 88] },
  { loc: [88, 89] },
  { loc: [89, 90] },
  { loc: [90, 91] },
  { loc: [54, 55] },
  { loc: [55, 58 ] },
  { loc: [58, 61] },
  { loc: [61, 62] },
  { loc: [62, 64] },
  { loc: [64, 65] },
  { loc: [66, 68] },
  { loc: [68, 70] },
  { loc: [70, 71] },
  { loc: [8, 9], title: 'Инициализация буфферов'},
  { loc: [73, 81], title: 'Инициализация буфферов'},
  { loc: [74, 75] },
  { loc: [75, 76] },
  { loc: [76, 81] },
  { loc: [81, 82] },
  { loc: [82, 83] },
  { loc: [83, 84] },
  { loc: [9, 10], title: 'Подготовка заднего фона'},
  { loc: [10, 11], title: 'Еще что то'},
  { loc: [124, 137], title: 'Функция отрисовки'},
  { loc: [125, 126] },
  { loc: [126, 127] },
  { loc: [127, 133] },
  { loc: [93, 104] },
  { loc: [133, 134] },
  { loc: [105, 113] },
  { loc: [134, 135] },
  { loc: [114, 123] },
  { loc: [135, 136] },
  { loc: [136, 144] },
  { loc: [144, 149] },
  { loc: [149, 154] },
  { loc: [154, 159] }
];
