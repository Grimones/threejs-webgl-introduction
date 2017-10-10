// Import React
import React, { Component } from 'react';

// Import Spectacle Core tags
import { Deck, Slide, Heading, Appear, Layout, Fill, Fit } from 'spectacle';
import { SplitViewCodeSlide, CodeSlide } from './lib';
import CubeDemo from './Components/CubeDemo';
import { lol } from './assets/code';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');
require('spectacle/lib/themes/default/index.css');
import './test.css';

const theme = createTheme({
  primary: 'white',
  secondary: 'black',
  quartenary: '#122b45',
  background: '#03A9FC'
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

  render() {
    return (
      <Deck
        theme={theme}
        contentHeight={window.innerHeight}
        contentWidth={window.innerWidth - 100} >
        <Slide transition={['fade']}>
          <CubeDemo />
          <Heading
            size={1}
            fit
            caps
            lineHeight={1}
            textColor="primary"
            style={{ textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000' }}>
          Introduction to ThreeJS
          </Heading>
        </Slide>
        <Slide
          transition={['fade']} getAppearStep={step => this.setStep('cubeDemoStep', step)}>
          <CubeDemo step={this.state.cubeDemoStep} />
          <Appear>
            <Heading size={1} caps fit textColor="secondary">
              Rotate X
            </Heading>
          </Appear>
          <Appear>
            <Heading size={1} caps fit textColor="secondary">
              Rotate Y
            </Heading>
          </Appear>
          <Appear>
            <Heading size={1} caps fit textColor="background">
              Rotate both X and Y
            </Heading>
          </Appear>
        </Slide>
        <SplitViewCodeSlide
          getStep={(step, total) => this.setStep('cubeDemoStep2', step)}
          rightPane={<CubeDemo step={this.state.cubeDemoStep2} />}
          showLineNumbers={false}
          transition={[]}
          lang="jsx"
          code={lol}
          ranges={[
            { loc: [0] },
            { loc: [0, 1] },
            { loc: [24, 25] },
            { loc: [53, 56] }
          ]}
        />
        <CodeSlide
          getStep={(step, total) => console.log(step, total)}
          transition={[]}
          lang="jsx"
          code={lol}
          ranges={[
            { loc: [0, 270], title: 'Walking through some code' },
            { loc: [4, 9], title: 'The Beginning' },
            { loc: [1, 2] },
            { loc: [33, 43], note: 'Heres a note!' }
            // ...
          ]}
        />
      </Deck>
    );
  }
}

export default Presentation;
