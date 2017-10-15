import React, { Component } from 'react';

import { Deck, Slide, Heading, Appear } from 'spectacle';
import { SplitViewCodeSlide, CodeSlide } from 'spectacle-code-slide';

import 'normalize.css';
import 'spectacle/lib/themes/default/index.css';

import * as SceneViews from './scene-views';

import createTheme from 'spectacle/lib/themes/default';

// Require CSS

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
        <Slide transition={['fade']}>
          <SceneViews.Slide02.View />
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
        <Slide transition={['fade']} getAppearStep={step => this.setStep('cubeDemoStep', step)}>
          {this.createSteps(SceneViews.Slide02.steps)}
          <SceneViews.Slide02.View step={this.state.cubeDemoStep} />
        </Slide>
        <SplitViewCodeSlide
          getStep={step => this.setStep('cubeDemoStep2', step)}
          rightPane={<SceneViews.Slide02.View step={this.state.cubeDemoStep2} />}
          showLineNumbers={false}
          transition={['fade']}
          lang="jsx"
          code={SceneViews.Slide02.code}
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
          code={SceneViews.Slide02.code}
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
