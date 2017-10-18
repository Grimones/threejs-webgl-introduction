import React, { Component } from 'react';
import 'normalize.css';
import 'spectacle/lib/themes/default/index.css';
import createTheme from 'spectacle/lib/themes/default';

import { Deck, Slide, Heading, Appear, Text, Notes, List, ListItem } from 'spectacle';
import { CodeSlide } from 'spectacle-code-slide';

import * as SceneViews from './scene-views';

const theme = createTheme({
  primary: 'white',
  secondary: 'black',
  accent: '#E2336E',
  quarternary: 'rgba(255, 255, 255, 0.1)',
  background: '#2D2D2D'
}, {
  primary: { name: 'Roboto', googleFont: true, styles: ['400'] }
});

const gradients = {
  pinkVioletGradient: 'linear-gradient(45deg,  #E2336E 0%,#7537E7 100%)'
};

class Presentation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slide5: 0,
      slide19: 0,
      slide20: 0,
      slide21: 0,
      slide22: 0,
      slide23: 0,
      slide24: 0
    };
  }

  setStep(slideStep, step) {
    if (this.state[slideStep] !== step) {
      this.setState({ [slideStep]: step });
    }
  }

  createSteps(length) {
    const steps = [];
    for (let i = 0; i < length; i++) {
      steps.push(<Appear key={i}><div /></Appear>);
    }
    return steps;
  }

  render() {
    return (
      <Deck
        theme={theme}
        progress="bar"
        contentHeight={window.innerHeight}
        contentWidth={window.innerWidth - 100} >
        {/* 1  intro */}
        <Slide transition={['fade']} style={{ background: gradients.pinkVioletGradient }}>
          <SceneViews.Slide1.View />
          <Appear>
            <Heading fit lineHeight={1} textColor="background">
              WebGL
            </Heading>
          </Appear>
          <Appear>
            <Heading fit lineHeight={1}textColor="background">
              Three.js
            </Heading>
          </Appear>
        </Slide>
        {/* 2 what is WebGL */}
        <Slide transition={['fade']} bgColor="background">
          <Heading fit lineHeight={2} textColor="accent">
            Что такое WebGL?
          </Heading>
          <Appear>
            <Text textSize={40} textColor="primary" style={{ textAlign: 'left' }}>
              Это программная библиотека для языка программирования JavaScript, позволяющая создавать на JavaScript интерактивную 3D-графику.
            </Text>
          </Appear>
        </Slide>
        {/* 3 More info about WebGL */}
        <Slide transition={['fade']} bgColor="background" textColor="primary">
          <List>
            <Appear><ListItem>Разработана Khronos Group</ListItem></Appear>
            <Appear><ListItem>Построена на базе OpenGL ES 2.0</ListItem></Appear>
            <Appear><ListItem>За счет использования низкоуровневых средств поддержки OpenGL, часть кода на WebGL может выполняться непосредственно на видеокартах</ListItem></Appear>
            <Appear><ListItem>Является контекстом элемента canvas HTML</ListItem></Appear>
          </List>
          <Notes>
            <ol>
              <li>
                Khronos Group - промышленный консорциум, целью которого является выработка открытых стандартов
                интерфейсов программирования (API) в области создания и воспроизведения динамической графики и
                звука на широком спектре платформ и устройств, с поддержкой аппаратного ускорения. В консорциум входят более 100 компаний.
                <br />
                <br />
                Vulkan, OpenGL, OpenGL ES, WebGL, Collada
              </li>
              <br />
              <li>
                OpenGL - (Open Graphics Library) спецификация, определяющая платформонезависимый программный интерфейс для написания приложений, использующих двумерную и трёхмерную компьютерную графику
              </li>
              <br />
              <li>
                OpenGL ES - embedded systems (Встраиваемые системы). Начиная аж с Symbian
              </li>
            </ol>
          </Notes>
        </Slide>
        {/* 4 Teapot */}
        <Slide transition={['fade']} bgColor="background">
          <SceneViews.Slide4.View />
          <Heading fit lineHeight={2} bold textColor="accent">
            WebGL pipeline
          </Heading>
        </Slide>
        {/* 5 The pipeline itself */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide5', step)} >
          {this.createSteps(SceneViews.Slide5.steps)}
          <SceneViews.Slide5.View step={this.state.slide5} />
        </Slide>
        {/* 6 Things we need for render */}
        <Slide transition={['fade']} bgColor="background">
          <Heading fit lineHeight={2} textColor="accent">
            Что необходимо для рендеринга?
          </Heading>
          <List textColor="primary">
            <Appear><ListItem>Canvas</ListItem></Appear>
            <Appear><ListItem>Точки || вертексы || вершины</ListItem></Appear>
            <Appear><ListItem>Вертексный шейдер</ListItem></Appear>
            <Appear><ListItem>Фрагментный шейдер</ListItem></Appear>
            <Appear><ListItem>Буфферы</ListItem></Appear>
            <Appear><ListItem>Матрицы вьюпорта и модели</ListItem></Appear>
            <Appear><ListItem>Функция отрисовки</ListItem></Appear>
          </List>
        </Slide>
        {/* 7 WebGL sample code */}
        <CodeSlide
          transition={['fade']}
          lang="jsx"
          code={SceneViews.Slide8.code}
          ranges={SceneViews.Slide8.ranges}
        />
        {/* 8 WebGL sample*/}
        <Slide transition={['fade']} bgColor="background">
          <SceneViews.Slide8.View />
        </Slide>
        {/* 9 WebGL animated sample code */}
        <CodeSlide
          transition={['fade']}
          lang="jsx"
          code={SceneViews.Slide10.code}
          ranges={SceneViews.Slide10.ranges}
        />
        {/* 10 WebGL animated sample */}
        <Slide transition={['fade']} bgColor="background">
          <SceneViews.Slide10.View />
        </Slide>
        {/* 11 Threejs */}
        <Slide transition={['fade']} bgImage="assets/three-bg.jpg" bgDarken={0.85}>
          <Heading fit lineHeight={1} textColor="accent">
            Three.js
          </Heading>
        </Slide>
        {/* 12 About Three.js */}
        <Slide bgImage="assets/three-bg.jpg" bgDarken={0.85}>
          <Appear>
            <Heading textColor="primary" textSize={200}>
              36.000 &#9733;
            </Heading>
          </Appear>
          <Appear>
            <Heading textColor="accent" textSize={200}>
              13.000 forks
            </Heading>
          </Appear>
          <Appear>
            <Heading fit textColor="primary" textSize={200}>
              20.000 commits
            </Heading>
          </Appear>
          <Appear>
            <Heading fit textColor="accent" textSize={200}>
              860 contributors
            </Heading>
          </Appear>
        </Slide>
        {/* 13 iframe documentation */}
        <Slide transition={['fade']} bgColor="background">
          <iframe
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: window.innerWidth,
              height: window.innerHeight,
              transform: 'translate(-50%, -50%)'
            }}
            src="https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene"
          />
        </Slide>
        {/* 14 iframe examples */}
        <Slide transition={['fade']} bgColor="background">
          <iframe
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: window.innerWidth,
              height: window.innerHeight,
              transform: 'translate(-50%, -50%)'
            }}
            src="https://threejs.org/examples/#webgl_gpgpu_water"
          />
        </Slide>
        {/* 15 Suzanne monkey */}
        <Slide transition={['fade']} bgColor="background">
          <SceneViews.Slide15.View />
          <Heading fit lineHeight={1} bold textColor="accent">
            Hello Three.js
          </Heading>
        </Slide>
        {/* 16 How Three.js works*/}
        <Slide transition={['fade']} bgColor="background">
          <Heading fit lineHeight={1} textColor="accent">
            Как работает Three.js?
          </Heading>
          <List textColor="primary">
            <Appear><ListItem>WebGLRenderer</ListItem></Appear>
            <Appear><ListItem>Canvas</ListItem></Appear>
            <Appear><ListItem>Камера</ListItem></Appear>
            <Appear><ListItem>Сцена</ListItem></Appear>
            <Appear><ListItem>Модели</ListItem></Appear>
            <Appear><ListItem>Свет</ListItem></Appear>
          </List>
        </Slide>
        {/* 17 Three.js sample code*/}
        <CodeSlide
          transition={['fade']}
          lang="jsx"
          code={SceneViews.Slide18.code}
          ranges={SceneViews.Slide18.ranges}
        />
        {/* 18 Three.js sample */}
        <Slide transition={['fade']} bgColor="background">
          <SceneViews.Slide18.View />
        </Slide>
        {/* 19 Continue sample */}
        <Slide bgColor="background" getAppearStep={step => this.setStep('slide19', step)} >
          {this.createSteps(SceneViews.Slide19.steps)}
          <SceneViews.Slide19.View step={this.state.slide19} />
        </Slide>
        {/* 20 Camera types */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide20', step)} >
          {this.createSteps(SceneViews.Slide20.steps)}
          <SceneViews.Slide20.View step={this.state.slide20} />
        </Slide>
        {/* 21 Geometry types */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide21', step)} >
          {this.createSteps(SceneViews.Slide21.steps)}
          <SceneViews.Slide21.View step={this.state.slide21} />
        </Slide>
        {/* 22 Materials */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide22', step)} >
          {this.createSteps(SceneViews.Slide22.steps)}
          <SceneViews.Slide22.View step={this.state.slide22} />
        </Slide>
        {/* 23 Material settings */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide23', step)} >
          {this.createSteps(SceneViews.Slide23.steps)}
          <SceneViews.Slide23.View step={this.state.slide23} />
        </Slide>
        {/* 25 Light types */}
        <Slide transition={['fade']} bgColor="background" getAppearStep={step => this.setStep('slide24', step)} >
          {this.createSteps(SceneViews.Slide24.steps)}
          <SceneViews.Slide24.View step={this.state.slide24} />
        </Slide>
        {/* 27 Interaction */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 28 Mouse interaction */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 30 Loaders */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>



        {/* 31 Cooler things */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 29 Animations */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 32 Canvas renderer */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 33 Shape editor */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 34 iframe matrices */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 35 iframe vectors */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 36 iframe quaternions */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 36 iframe helpers */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 37 Buffer geometry */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 38 Custom attributes */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 38 Custom shaders */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 39 Particles systems */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 38 Render to texture */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 40 GPGPU */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 24 Video textures */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 41 Realtime reflections https://threejs.org/examples/webgl_materials_cubemap_dynamic2.html */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 41 mirror */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 41 Realtime refraction */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 45 Sky Shader */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 42 Roughness */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 43 Post processing */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 44 WebVR */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 45 Physics */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 46 Conclusion */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 47 Useful links */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
        {/* 48 Questions */}
        <Slide transition={['fade']} bgColor="background">
        </Slide>
      </Deck>
    );
  }
}

export default Presentation;


/* <SplitViewCodeSlide
  getStep={step => this.setStep('cubeDemoStep2', step)}
  rightPane={<SceneViews.Slide2.View step={this.state.cubeDemoStep2} />}
  showLineNumbers={false}
  transition={['fade']}
  lang="jsx"
  code={SceneViews.Slide2.code}
  ranges={[
    { loc: [0] },
    { loc: [0, 1] },
    { loc: [24, 25] },
    { loc: [53, 56] }
  ]}
/> */
