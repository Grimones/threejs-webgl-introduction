import React from 'react';
import { render } from 'react-dom';

import Presentation from './presentation';

const root = document.getElementById('root');
root.style.background = '#2D2D2D';

render(<Presentation />, root);

if (module.hot) {
  if (module.hot) {
    module.hot.accept();
  }
}
