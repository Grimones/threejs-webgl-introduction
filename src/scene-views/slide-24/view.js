import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slide24Scene } from '../../three/scenes';
import { AppearBlock } from '../../components';

const stepLabels = [
  'const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0);',
  'hemisphereLight.intensity = 10',
  'hemisphereLight.color.setRGB(0, 1, 0);',
  'const directionalLight = new THREE.DirectionalLight(\'#fff\', 0)',
  'directionalLight.intensity = 2',
  'directionalLight.position.set(30, 40, 40)',
  'const pointLight = new THREE.PointLight( \'#fff\', 0 )',
  'pointLight.position.set(20, 5, 10)',
  'const spotLight = new THREE.SpotLight( \'#fff\', 0, 0, Math.PI / 9, 0.4 );',
  'spotLight.angle = Math.PI / 16',
  'spotLight.angle = Math.PI / 8',
  'spotLight.penumbra = 0',
  'spotLight.penumbra = 0.8',
  'spotLight.castShadow = true'
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
