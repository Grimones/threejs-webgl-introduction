import React from 'react';
import { render } from 'react-dom';

import Presentation from './presentation';

const root = document.getElementById('root');

render(<Presentation />, root);

if (module.hot) {
  if (module.hot) {
    module.hot.accept();
  }
}
