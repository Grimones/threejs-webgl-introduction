import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slide24Scene } from '../../three/scenes';
import { AppearBlock } from '../../components';

const stepLabels = [
  '',
  'this.mesh.position.x += 10',
  'this.mesh.position.x -= 20',
  'this.mesh.scale.set(2, 2, 2)',
  'this.mesh.scale.setY(0.5)',
  'this.mesh.rotation.y += THREE.Math.degToRad(90)',
  'this.mesh.scale.setZ(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)',
  'this.mesh.scale.setX(0.5)'
];

export const steps = stepLabels.length - 1;

export class View extends Component {
  componentDidMount() {
    this.scene = new Slide24Scene(this.threeCanvas, false, false);
    this.scene.loopRender();
    window.addEventListener('resize', this.handleResize);
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
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.scene.resizeRenderer(window.innerWidth, window.innerHeight);
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
          backgroundColor="rgba(45, 45, 45, 0.8)"
          textColor="white"
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
