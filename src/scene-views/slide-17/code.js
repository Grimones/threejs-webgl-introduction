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
  { loc: [12, 18], title: 'Инициализация WebGL' },
  { loc: [13, 14], note: 'Достаем WebGL контекст' },
  { loc: [14, 16], note: 'Записываем размеры вьюпорта' },
  { loc: [16, 17], note: 'Возвращаем экземпляр' },
  { loc: [3, 4], title: 'Инициализация WebGL' },
  { loc: [4, 5], title: 'Вертексный шейдер'},
  { loc: [19, 31], title: 'Вертексный шейдер', note: 'Просто текст (string literal, так удобнее)' },
  { loc: [21, 22], note: 'Позиция которую передаем извне' },
  { loc: [23, 24], note: 'Матрица самой модели которую отрисовываем' },
  { loc: [24, 25], note: 'Матрица перспективы, то есть откуда мы смотрим' },
  { loc: [26, 29], note: 'Основная функция. Возвращает просто позицию точки' },
  { loc: [27, 28] },
  { loc: [4, 5], title: 'Вертексный шейдер'},
  { loc: [5, 6], title: 'Фрагментный шейдер'},
  { loc: [32, 41], title: 'Фрагментный шейдер', note: 'Так же текст' },
  { loc: [34, 35], note: 'Точность расчетов' },
  { loc: [36, 39], note: 'Основная функция. Возвращает просто цвет пикселя' },
  { loc: [37, 38] },
  { loc: [5, 6], title: 'Фрагментный шейдер'},
  { loc: [6, 7], title: 'Заполнение вертексов'},
  { loc: [42, 49], title: 'Заполнение вертексов'},
  { loc: [6, 7], title: 'Заполнение вертексов'},
  { loc: [7, 8], title: 'Создание шейдерной программы'},
  { loc: [50, 70], title: 'Создание шейдерной программы'},
  { loc: [51, 53], note: 'Компилируем шейдеры' },
  { loc: [85, 91] },
  { loc: [86, 87], note: 'Создаем новый шейдер на видеокарте' },
  { loc: [87, 88], note: 'Вставляем туда текст шейдера' },
  { loc: [88, 89], note: 'Собственно компилируем' },
  { loc: [89, 90], note: 'И возвращаем' },
  { loc: [51, 53], note: 'Компилируем шейдеры' },
  { loc: [53, 54], note: 'Создание шейдерной программы' },
  { loc: [54, 57 ], note: 'Присоединяем и линкуем компилированные шейдеры в шейдерную программу' },
  { loc: [57, 60], note: 'Проверочка, если что то пойдет не так' },
  { loc: [60, 61], note: 'И говорим WebGL какую шейдерную программу использовать' },
  { loc: [61, 63], note: 'Узнаем куда WebGL поместил атрибуты компилированных шейдеров' },
  { loc: [63, 64], note: 'Включаем этот аттрибут как массив' },
  { loc: [65, 67], note: 'Тоже самое делаем для униформ' },
  { loc: [67, 69], note: 'Только на этот раз ничего включать не надо' },
  { loc: [69, 70], note: 'И возвращаем экземпляр' },
  { loc: [7, 8], title: 'Создание шейдерной программы'},
  { loc: [8, 9], title: 'Инициализация буфферов'},
  { loc: [72, 83], title: 'Инициализация буфферов'},
  { loc: [73, 74], note: 'Инициализируем буффер для вертексов' },
  { loc: [74, 75], note: 'Присоединяем этот буффер к WebGL' },
  { loc: [75, 80], note: 'И заполняем нашими координаторами точек' },
  { loc: [80, 81], note: 'Указываем какая длинна каждого элемента (x, y, z)' },
  { loc: [81, 82], note: 'И указываем количество элементов' },
  { loc: [82, 83], note: 'Возвзращаем буффер' },
  { loc: [8, 9], title: 'Инициализация буфферов'},
  { loc: [9, 10], title: 'Подготовка заднего фона'},
  { loc: [123, 144], title: 'Функция отрисовки'},
  { loc: [124, 125], note: 'Создаем вьюпорт' },
  { loc: [125, 126], note: 'Очищаем буфферы цвета и глубины' },
  { loc: [126, 132], note: 'Высчитываем матрицу перспективы' },
  { loc: [92, 103], note: 'Это сурово' },
  { loc: [126, 132], note: 'Высчитываем матрицу перспективы' },
  { loc: [132, 133], note: 'Создаем матрицу модели' },
  { loc: [104, 112], note: 'Опять матрицы' },
  { loc: [132, 133], note: 'Создаем матрицу модели' },
  { loc: [133, 134], note: 'Чуть двигаем матрицу чтобы модель попала во вьюпорт' },
  { loc: [113, 122], note: 'парам-пам-пам' },
  { loc: [133, 134], note: 'Чуть двигаем матрицу чтобы модель попала во вьюпорт' },
  { loc: [134, 142], note: 'Указываем в какой буффер смотреть чтобы узнать позицию вертексов' },
  { loc: [142, 147], note: 'Заполняем униформу в шейдере матрицей перспективы' },
  { loc: [147, 152], note: 'Тоже самое делаем для матрицы модели' },
  { loc: [152, 157], note: 'И наконец рисуем все что затолкали в массивы и буфферы!' }
];
