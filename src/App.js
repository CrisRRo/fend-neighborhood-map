import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { markerLocations } from './AppData.js'
import MapContainer from './MapContainer.js';


class App extends Component {
  	state = {
		activeLocations: [], // DE STERS
		allInitialMarkers: []
    }

	// DE STERS
	setMarkersLocations = (locations) => {
		this.setState({
			activeLocations: locations
		})
	}
	
	storeAllInitialMarkers = (markers) => {
		this.setState({
			allInitialMarkers: markers
		})
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
					Recommended places for one day
					
					{console.log(this.state.allInitialMarkers)}
					
					<ul class='the-list'>
					{this.state.allInitialMarkers.map(marker => (
						<li key={marker.position} className='marker-title'>
							{marker.title}
								{console.log(marker.title)}
						</li>
					))}
					</ul>
					
				</section>
				<section id='map-container'>
					<MapContainer 
						markersLocations={markerLocations}
						getAllInitialMarkers={this.storeAllInitialMarkers}
					/>
				</section>
			</main>
		  </div>
		);
	}
}

export default App;
