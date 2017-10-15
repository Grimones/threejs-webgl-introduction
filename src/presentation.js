import React, { Component } from 'react';

import { Deck, Slide, Heading, Appear, Text, Notes, List, ListItem } from 'spectacle';
import { SplitViewCodeSlide, CodeSlide } from 'spectacle-code-slide';

import 'normalize.css';
import 'spectacle/lib/themes/default/index.css';

import * as SceneViews from './scene-views';

import createTheme from 'spectacle/lib/themes/default';

// Require CSS

const theme = createTheme({
  primary: 'white',
  secondary: 'black',
  quartenary: '#E2336E',
  background: '#2D2D2D'
}, {
  primary: { name: 'Roboto', googleFont: true, styles: ['400'] }
});

// style={{ background: 'linear-gradient(to bottom,  #11e8bb 0%,#8200c9 100%)'}}

class Presentation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cubeDemoStep: 0,
      cubeDemoStep2: 0
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
        <Slide transition={['fade']} style={{ background: 'linear-gradient(45deg,  #E2336E 0%,#7537E7 100%)'}}>
          <SceneViews.Slide1.View />
          <Heading
            fit
            lineHeight={1}
            textColor="primary"
            style={{ textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000' }}>
            Introduction to WebGL
            <div>with ThreeJS</div>
          </Heading>
        </Slide>
        <Slide transition={['fade']} bgColor="background">
          <Heading
            fit
            lineHeight={2}
            textColor="quartenary">
            Что такое WebGL?
          </Heading>
          <Appear>
            <Text textSize={40} textColor="primary" style={{ textAlign: 'left' }}>Это программная библиотека для языка программирования JavaScript, позволяющая создавать на JavaScript интерактивную 3D-графику.</Text>
          </Appear>
        </Slide>
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
        <SplitViewCodeSlide
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
        />
        <CodeSlide
          transition={['fade']}
          lang="jsx"
          code={SceneViews.Slide2.code}
          ranges={[
            { loc: [0, 270], title: 'Walking through some code' },
            { loc: [4, 9], title: 'The Beginning' },
            { loc: [1, 2] },
            { loc: [33, 43], note: 'Heres a note!' }
          ]}
        />
      </Deck>
    );
  }
}

export default Presentation;
