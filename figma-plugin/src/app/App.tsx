import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/ui.css';
import styles from './app.module.scss';

function App() {
  console.log('styles', styles);
  return (
    <div>
      <div className="label">Hello world (!)</div>
      <div className={styles.redBox}>box #1</div>
      <div className={styles.redBox}>box #2</div>
    </div>
  );
}

export default App;
