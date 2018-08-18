import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { markerLocations } from "./AppData.js"
import * as AppData from './AppData'
// importing the marker icons
import pinkFlag from './icons/pinkFlag.png'
import pinkFlag2 from './icons/pinkFlag2.png'
import greenFlag2 from './icons/greenFlag2.png'

class MapContainer extends Component {
	constructor(props) {
		super(props)
	}
		 
	state = {
        map: {},	  	// object
        markers: [],  	// array of objects - store the created markers
        markersInfoWindows: [],	// object
		openWindow: false, // Store the ID of the marker with infoWindow opened
		markersLocations: []
    }
	
	setMarkersLocations = (locations) => {
		this.setState({
			markersLocations: locations
		})
	}
	
	// Insert Google Map API script
	componentDidMount () {
		const script = document.createElement('script');
		
		script.src = 		'https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyDV-dtGMk8LBbgrxByBIlwmjgWOvzJ6rYM&v=3&callback=initMap';
		script.async = true;
		script.defer = true;
		
		// Give it a unique id, append to the body. If called more than once, the id already exist so no need to load it again
		script.id = 'mapId'
		
		document.getElementById('map-container').appendChild(script);
		
		window.initMap = this.initMap;
	}
	
	initMap = () => {
		this.map = new window.google.maps.Map(document.getElementById('map-content'), {
			center: {lat: 44.431474, lng: 26.100319},
			zoom: 15
		});
		
		// Initialize marker locations, then create markers
		this.setMarkersLocations(markerLocations);
		this.createMarkers();
	}
	
	createMarkers = () => {
		// Default icon style
		this.defaultIcon = {
			url: pinkFlag2,
			scaledSize: new window.google.maps.Size(50, 50)
		};
		
		// Icon style when the marker is clicked
		this.changedIcon = {
			url: greenFlag2,
			scaledSize: new window.google.maps.Size(80, 80)
		}
		
		// Instantiate infoWindow - Constanta asta este un obiect
		const markerInfowindow = new window.google.maps.InfoWindow({
			// content: "Prima fereastra",
			maxWidth: 300
		});
		
		// Store temporary all created infoWindows
		let infoWindows =[];
				
		// Create all the initial markers
		let markers = this.state.markersLocations.map((location, index) => {
			// Create each marker
			const marker = new window.google.maps.Marker({
				map: this.map,
				position: location.latLong,
				id: location.id,
				title: location.title,
				icon: this.defaultIcon,
				animation: window.google.maps.Animation.DROP
			});
			
			// Create an onclick event to open an infowindow at each marker.
			marker.addListener('click', () => {
				this.populateInfoWindow(marker, markerInfowindow);
			});
			
			markerInfowindow.addListener('closeclick', () => {
				// When the marker infoWindow is closed, change the icon back to its default
				marker.setIcon(this.defaultIcon);
				// Make sure the marker property is cleared if the infowindow is closed.
				markerInfowindow.setMarker = null;
				
				// Update the state - no infowindow is opened
				this.setState({
					openWindow: false
				})
			});
		
			infoWindows.push(markerInfowindow);
		  
			return marker;
		})
		
		this.setState({
			markers: markers,
			markersInfoWindows: infoWindows
		});
	

	}
	
	// Function to populate infoWindows
	populateInfoWindow = (marker, markerInfowindow) => {
				
		// Check that infowindow is not already opened on this marker => so open an infowindow
		if (markerInfowindow.marker != marker) {
			
			// Change all marker icons to their default state
			this.state.markers.map(marker => marker.setIcon(this.defaultIcon))	
			
			markerInfowindow.marker = marker;
			markerInfowindow.setContent('<div>' + marker.title + '</div>');
			markerInfowindow.open(this.map, marker);

			// The marker is clicked, so change the icon
			marker.setIcon(this.changedIcon);
			
			// An infowindow has been opened
			this.setState({
				openWindow: true
			})
		} 
	}

	render() {			
		return (
			<div id='map-content' role='application' aria-label='A map of Bucharest Old Town'></div>
		)
	}

}

export default MapContainer;