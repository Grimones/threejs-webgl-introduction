import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicScene from '../Scenes/BasicScene';

class CubeDemo extends Component {
  componentDidMount() {
    this.scene = new BasicScene(this.threeCanvas);
    this.scene.loopRender();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.step !== nextProps.step) {
      this.scene.setStep(nextProps.step);
      console.log(nextProps.step);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.step !== nextProps.step) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    console.log('unmounting');
    this.scene.stop();
    this.scene.dispose();
    this.scene = null;
  }

  render() {
    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <canvas
          width={window.innerWidth}
          height={window.innerHeight}
          ref={ref => { this.threeCanvas = ref; }}
        />
      </div>
    );
  }
}

CubeDemo.propTypes = {
  step: PropTypes.number
};

export default CubeDemo;
