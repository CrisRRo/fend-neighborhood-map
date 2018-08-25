import React, { Component } from 'react';
import './App.css';
import { initialLocations } from './AppData.js'
import MapContainer from './MapContainer.js';
import LeftSideBar from './LeftSideBar.js'

class App extends Component {
  	state = {
		markersLocations: initialLocations,
		locationsToBeListed: []
    }
	
	updateMarkerLocations = (locations, id = 'noId') => {
		let updatedLocations;
		
		// We have the id of the place the user clicked
		// on the left side bar => set in 'markersLocations'
		// the corresponding 'infowindow' field to true
		if (id !== 'noId') {
			updatedLocations = locations.map((location) => {
				// Another window was opened before => 
				// close it, before open another one
				if (location.infowindow) {
					location.infowindow = false;
					return location
				// This is the new window to be opened
				} else if (location.id === id) {
					location.infowindow = true;
					return location
				} else {
					return location
				}
			})
			this.setState({
				markersLocations: updatedLocations
			})
		}
	}
	
	updatelocationsToBeListed = (val = []) => {
		this.setState({
			locationsToBeListed: val
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
	
	// Update locations to be listed on left bar
	handleQuery = (userInput) => {
		const { markersLocations } = this.state

		let filteredLocations = markersLocations.filter((loc) => loc.title.toLowerCase().includes(userInput.toLowerCase()))
		
		if (userInput === '') {
			// User did not write anything
			this.updatelocationsToBeListed();
		} else if (filteredLocations.length === 0) {
				// No location match with the search
				this.updatelocationsToBeListed(['noMatch']);
			} else {
				// Locations should have this content
				this.updatelocationsToBeListed(filteredLocations);
			}
	}
  
	render = () => {	
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
				<LeftSideBar
					markersLocations={this.state.markersLocations}
					handleMarkersLocations={this.updateMarkerLocations}
					locationsToBeListed={this.state.locationsToBeListed}
					transferQuery={this.handleQuery}
				/>
				
				<section id='map-container'>
					<MapContainer
						markersLocations={this.state.markersLocations}
						locationsToBeListed={this.state.locationsToBeListed}
					/>
				</section>
			</main>
		  </div>
		);
	}
}

export default App;
