import React, { Component } from 'react';
import './App.css';
import { markerLocations } from './AppData.js'
import MapContainer from './MapContainer.js';
import LeftSideBar from './LeftSideBar.js'

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
	
	componentDidMount = () => {
		this.menu = document.getElementById('burger-menu')
		this.leftBar = document.getElementById('left-side-bar')
		this.mapContainer = document.getElementById('map-container')
	}
	
	onMenuClick = () => {
		this.menu.classList.toggle("change");
		this.leftBar.classList.toggle("open");
		this.mapContainer.classList.toggle("open");
	}
  
	render() {
		return (
		  <div className="App">
			<div id='burger-menu' role='button' tabIndex='0' aria-label='menu' onClick={this.onMenuClick}>
				<div className='burger1'></div>
				<div className='burger2'></div>
				<div className='burger3'></div>
			</div>
			<header className="App-header">
			  <h1 className="App-title">Bucharest Old Town Map</h1>
			</header>
			<main className="App-intro">

					<LeftSideBar markers={this.state.allInitialMarkers} />

				
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
