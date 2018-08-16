import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bucharest Old Town Map</h1>
        </header>
        <div className="App-intro">
          This should be left side bar
		  <MapContainer />
        </div>
      </div>
    );
  }
}

export default App;
