import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slide23Scene } from '../../three/scenes';
import { AppearBlock } from '../../components';

const stepLabels = [
  'material.flatShading = false',
  'material.flatShading = true',
  'material.flatShading = true //face normals',
  'material.flatShading = false //vertex normal',
  'material.flatShading = true',
  'material.color  = new THREE.Color(\'#e2336e\')',
  'material.wireframe = true',
  'material.wireframe = false',
  'material.transparent = true; material,opacity = 0.2',
  'material.flatShading = true; material.opacity = 1',
  'material.metalness = 1; material.roughness = 0',
  'material.metalness = 1; material.roughness = 0',
  'material.metalness = 1; material.roughness = 1',
  'material.metalness = 1; material.roughness = 0',
  'material.clearCoat = 1; material.clearCoatRoughness = 0',
  'material.clearCoat = 1; material.clearCoatRoughness = 0',
  'material.clearCoat = 1; material.clearCoatRoughness = 1',
  'material.clearCoat = 1; material.clearCoatRoughness = 0.25',
  'material.clearCoat = 0; material.clearCoatRoughness = 0.25',
  'material.clearCoat = 1; material.clearCoatRoughness = 0.25',
  'material.clearCoat = 1; material.clearCoatRoughness = 0.25',
  'material.map = albedoTexture',
  'material.roughness = roughnessTexture',
  'material.metallness = metalnessTexture',
  'material.nomral = normalTexture',
  'scene.background.color = new THREE.Color(\'#444\')',
  'material.alphaMap = alphaTexture'
];

export const steps = stepLabels.length - 1;

export class View extends Component {
  componentDidMount() {
    this.scene = new Slide23Scene(this.threeCanvas, false, false);
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
