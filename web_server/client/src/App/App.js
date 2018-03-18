import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';

import NewsPanel from '../NewPanal/NewsPanel';

class App extends Component {
  render() {
    return (
      <div>
        <img className='logo' src={logo} alt='logo'/>
        <br/>
        <div className='container'>
          <NewsPanel />
        </div>
      </div>
    );
  }
}

export default App;
