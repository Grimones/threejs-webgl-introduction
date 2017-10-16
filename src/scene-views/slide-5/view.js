import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slide5Scene } from '../../three/scenes';
import { AppearBlock } from '../../components';

const stepLabels = [
  'grid',
  'vertices',
  'positions',
  'edges',
  'face',
  'animate face',
  'hide grid and positions',
  'show RT grid',
  'show RT face',
  'Rotate camera',
  'rotate back'
];

export const steps = stepLabels.length - 1;

export class View extends Component {
  componentDidMount() {
    this.scene = new Slide5Scene(this.threeCanvas, false, true);
    this.scene.loopRender();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.step !== nextProps.step) {
      this.scene.setStep(nextProps.step);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.step !== nextProps.step) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.scene.stop();
    this.scene.dispose();
    this.scene = null;
  }

  render() {
    return (
      <div
        style={{
          position: 'absolute',
          width: window.innerWidth,
          height: window.innerHeight,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        <AppearBlock
          label={stepLabels[this.props.step]}
          backgroundColor="papayawhip"
          textColor="tomato"
        />
        <canvas
          style={{ position: 'absolute', left: 0, top: 0 }}
          width={window.innerWidth}
          height={window.innerHeight}
          ref={ref => { this.threeCanvas = ref; }}
        />
      </div>
    );
  }
}

View.propTypes = {
  step: PropTypes.number
};
