export const code = `
import * as THREE from 'three';
import OrbitControls from '../utils/OrbitControls';

export default class Scene {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true
    });
    this.renderer.setSize(canvas.width, canvas.height);
    this.camera = new THREE.PerspectiveCamera(
      60, 
      canvas.width / canvas.height, 
      1, 
      10000
    );
    this.camera.position.setZ(30);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1));
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    const geometry = new THREE.OctahedronGeometry(8, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: '#E2336E', 
      flatShading: true 
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
    this.clock = new THREE.Clock();
    this.requestLoop = undefined;
  }

  resizeRenderer(width, height) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  loopRender = () => {
    const delta = this.clock.getDelta();
    this.mesh.rotation.y += delta;
    this.renderer.render(this.scene, this.camera);
    this.requestLoop = requestAnimationFrame(this.loopRender);
  }

  stop() {
    if (this.requestLoop) {
      cancelAnimationFrame(this.requestLoop);
      this.requestLoop = undefined;
    }
  }

  dispose() {
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
    this.scene = null;
    this.camera = null;
    this.controls.dispose();
    this.mesh.geometry.dispose();
    this.mesh.geometry = null;
    this.mesh.material.dispose();
    this.mesh.material = null;
    this.mesh = null;
    this.renderer.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
    this.renderer.canvas = null;
    this.renderer = null;
    this.canvas = null;
  }
}
`;

export const ranges = [
  { loc: [1, 2], title: 'Импорт Three.js' },
  { loc: [2, 3], title: 'Импорт управления' },
  { loc: [5, 33], title: 'Инициализация' },
  { loc: [6, 10], note: 'Создаем рендерер' },
  { loc: [10, 11], note: 'Устанавливаем ему размер' },
  { loc: [11, 17], note: 'Создаем камеру' },
  { loc: [17, 18], note: 'Чуть отодвигаем ее' },
  { loc: [18, 19], note: 'Инициализируем управление' },
  { loc: [19, 20], note: 'Включаем его' },
  { loc: [20, 21], note: 'Создаем сцену' },
  { loc: [21, 23], note: 'Создаем свет и сразу добавляем в сцену' },
  { loc: [23, 24], note: 'Создаем геометрию' },
  { loc: [24, 28], note: 'Создаем материал' },
  { loc: [28, 29], note: 'Теперь создаем наконец модель' },
  { loc: [29, 30], note: 'И добавляем ее в сцену' },
  { loc: [30, 31], note: 'Внутренние часы' },
  { loc: [31, 32], note: 'ID для остановки' },
  { loc: [40, 46], title: 'Функция отрисовки' },
  { loc: [41, 42], note: 'Получаем разницу времени из внутренних часов' },
  { loc: [42, 43], note: 'Просто добавляем к Х вращению модели' },
  { loc: [43, 44], note: 'И все это добро просто отрисовываем' },
  { loc: [44, 45], note: 'В конце опять вызывая функцию' },
  { loc: [47, 53], title: 'Функция остановки рендеринга' },
  { loc: [49, 50], note: 'Просто останавливаем используя ID' },
  { loc: [50, 51], note: 'И обнуляем переменную' },
  { loc: [34, 39], title: 'Функция ресайза' },
  { loc: [34, 35], note: 'Принимает высоту и ширину' },
  { loc: [35, 36], note: 'Меняем размер рендерера' },
  { loc: [36, 37], note: 'Меняем соотношение сторон камеры' },
  { loc: [37, 38], note: 'И обновляем матрицу проекции' },
  { loc: [54, 74], title: 'Функция освобждения памяти' }
];
