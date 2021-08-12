import React from 'react';
import { BrowserRouter, HashRouter, Router } from 'react-router-dom';
import LeftMenu from './modules/components/left-menu';
import Routes from './modules/router/routing';

function App() {
  return (
    <div className="app-wrapper">
      <HashRouter>
        <LeftMenu />
        <div className="page-wrapper" style={{position: 'relative'}}>
          <Routes />
        </div>
      </HashRouter>
    </div>
  )
}

export default App;
