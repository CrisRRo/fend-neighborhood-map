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
        infoWindow: {},	// object
		windowsOpened: [], // Store the IDs of markers with infoWindow opened
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
		const defaultIcon = {
				url: pinkFlag2,
				scaledSize: new window.google.maps.Size(50, 50)
			};
		// Icon style when infoWindow is open
		const changedIcon = {
				url: greenFlag2,
				scaledSize: new window.google.maps.Size(80, 80)
			};
			
		// TODO: DELETE THIS - Create first marker
		const latLong = {lat: 44.43196, lng: 26.10237};

		
		// TODO: DELETE THIS - Markerul este un obiect
		const marker = new window.google.maps.Marker({
			map: this.map,
			position: latLong,
			id: 'ChIJlSLTBz__sUAReaifnojCDYs',
			title: 'Choco Museum',
			icon: defaultIcon,
			animation: window.google.maps.Animation.DROP
		});
		
		let markers = this.state.markersLocations.map((location, index) => {
			const marker = new window.google.maps.Marker({
				map: this.map,
				position: location.latLong,
				id: location.id,
				title: location.title,
				icon: defaultIcon,
				animation: window.google.maps.Animation.DROP
			});
			return marker;
		})
		
		this.setState({markers: markers});
		console.log(this.state.markers);
		

		
		// TODO: DE STERS - Constanta asta este un obiect
		const infoWindow = new window.google.maps.InfoWindow({
			content: "Prima fereastra",
			maxWidth: 170
		});
		
		console.log(infoWindow);
		
		marker.addListener('click', function() {
			infoWindow.open(this.map, marker);

			// When marker is clicked, change the icon
			marker.setIcon(changedIcon);
		});
		
		infoWindow.addListener('closeclick', function() {
			// When the marker infoWindow is closed, change the icon back to its default
			marker.setIcon(defaultIcon);
		});
		
	}

	render() {			
		return (
			<div id='map-content' role='application' aria-label='A map of Bucharest Old Town'></div>
		)
	}

}

export default MapContainer;