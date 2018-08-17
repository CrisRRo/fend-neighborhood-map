import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapContainer from './MapContainer.js';
import * as AppData from './AppData';
import { markerLocations } from "./AppData.js"

class App extends Component {
  constructor(props) {
    super(props)
  }
  
  state = {
	  markersLocations: markerLocations
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bucharest Old Town Map</h1>
        </header>
        <main className="App-intro">
			<section id='left-side-bar'>
				This should be left side bar
			</section>
			<section id='map-container'>
				<MapContainer 
					markersLocations={this.state.markersLocations}
				/>
			</section>
        </main>
      </div>
    );
  }
}

export default App;
