import React, { Component } from 'react';
import './App.css';
import { initialLocations } from './AppData.js'
import MapContainer from './MapContainer.js';
import LeftSideBar from './LeftSideBar.js'

class App extends Component {
  	state = {
		markersLocations: initialLocations,
		locationsToBeListed: [],
		allInitialMarkers: [],
		allInitialInfowindows: [],
		map: {}
    }
	
	updateMarkerLocations = (locations, id = 'noId') => {
		console.log(this.state.markersLocations);
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
		console.log(this.state.markersLocations);
	}
	
	// DE STERS
	storeAllInitialMarkers = (markers) => {
		this.setState({
			allInitialMarkers: markers
		})
	}
	
	// DE STERS
	storeAllInitialInfowindows = (infowindows) => {
		this.setState({
			allInitialInfowindows: infowindows
		})
	}
	
	storeMap = (map) => {
		this.setState({
			map: map
		})
	}
	
	componentDidMount = () => {
		this.menu = document.getElementById('burger-menu')
		this.leftBar = document.getElementById('left-side-bar')
		this.mapContainer = document.getElementById('map-container')
	}
	
	componentDidUpdate = (prevProps, prevState) => {
		
		if (this.state.markersLocations !== prevState.markersLocations) {
            console.log('Avem un infowindow de deschis');
			
			this.state.markersLocations.forEach((l) => console.log('This state' + l.infowindow))
			
			prevState.markersLocations.forEach((l) => console.log('Prev state' + l.infowindow))

        }
	}
	
	onMenuClick = () => {
		this.menu.classList.toggle("change");
		this.leftBar.classList.toggle("open");
		this.mapContainer.classList.toggle("open");
	}
	
	handleQuery = (userInput) => {
		// TODO
		console.log('Asta a tastat userul: ' + userInput)
	}
  
	render = () => {
		console.log('Sunt in App.js render');
		console.log(this.state.markersLocations);
		
		// DE STERS
		let filteredLocations0;
		if (this.state.markersLocations !== initialLocations) {
			console.log("S-a modificat locatia");
			filteredLocations0 = this.state.markersLocations;
		} else {
			console.log("Locatiile initiale");
			filteredLocations0 = initialLocations;
		}
		// PANA AICI
		
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
				{console.log('Left side bar - inainte')}
				<LeftSideBar
					markersLocations={this.state.markersLocations}
					handleMarkersLocations={this.updateMarkerLocations}
					locationsToBeListed={this.state.locationsToBeListed}
					transferQuery={this.handleQuery}
				/>
				{console.log('Left side bar - dupa')}
				
				<section id='map-container'>
					{console.log('Map container - inainte')}
					<MapContainer
						markersLocations={this.state.markersLocations}
						handleMarkersLocations={this.updateMarkerLocations}
						idToOpenWindow={this.state.idToOpenInfowindow}
						getAllInitialMarkers={this.storeAllInitialMarkers} getAllInitialInfowindows={this.storeAllInitialInfowindows} 
						getMap={this.storeMap}
					/>
					{console.log('Map container - dupa')}
				</section>
			</main>
		  </div>
		);
	}
}

export default App;
