import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Slide8Scene } from '../../three/scenes';

export class View extends Component {
  componentDidMount() {
    this.scene = new Slide8Scene(this.canvas);
    this.scene.drawScene();
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
        <canvas
          style={{ position: 'absolute', left: 0, top: 0 }}
          width={window.innerWidth}
          height={window.innerHeight}
          ref={ref => { this.canvas = ref; }}
        />
      </div>
    );
  }
}

View.propTypes = {
  step: PropTypes.number
};
