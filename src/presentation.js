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
  quartenary: '#E2336E',
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
      slide5: 0
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
          <Heading fit lineHeight={2} textColor="quartenary">
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
          <Heading fit lineHeight={2} bold textColor="quartenary">
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
          <Heading fit lineHeight={2} textColor="quartenary">
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
