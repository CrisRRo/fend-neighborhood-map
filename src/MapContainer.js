import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFoursqPlaceId, getVenueDetails } from './InfoWindow.js';
// importing the marker icons
import pinkFlag2 from './icons/pinkFlag2.png'
import greenFlag2 from './icons/greenFlag2.png'

class MapContainer extends Component {
	
	static propTypes = {
		markersLocations: PropTypes.array.isRequired,
		locationsToBeListed: PropTypes.array.isRequired,
		getAllInitialMarkers: PropTypes.func,
		getAllInitialInfowindows: PropTypes.func,
		getMap: PropTypes.func
	}
		
	state = {
        map: {},	  	// object
        markers: [],  	// store the created markers
		openWindow: false, // Show if the infoWindow is opened or not on a marker
		prevIdOpened: '' // Keep the id of the marker we opened the infowindow manually
    }
	
	updateMap = (map) => {
		this.setState({
			map: map
		})
	}
	
	updatePrevIdOpened = (prevId) => {
		this.setState({
			prevIdOpened: prevId
		})
	}
	
	// DE STERS
	consola = () => {
		console.log('Si in return se vede markerul')
	}
	
	componentWillMount = () => {
		console.log('MapContainer component WILL mount');
	}
	
	componentWillUnmount = () => {
		console.log('MapContainer component WILL UNMOUNT');
	}
	
	shouldComponentUpdate = () => {
		console.log('MapContainer component SHOULD UPDATE');
		return true;
	}
	
	componentDidUpdate = () => {
		console.log('MapContainer component DID UPDATE');
	}

	
	// Insert Google Map API script
	componentDidMount = () => {
		console.log('MapContainer component DID mount')
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
		const myMap = new window.google.maps.Map(document.getElementById('map-content'), {
			center: {lat: 44.431474, lng: 26.100319},
			zoom: 15
		});
		
		// Initialize marker locations, then create markers
		this.createMarkers(myMap);
	}
	
	createMarkers = (myMap) => {
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
			maxWidth: 300
		});
		
		// Instantiate bounds for our markers
		const bounds = new window.google.maps.LatLngBounds();
		
		// Store temporary all created infoWindows
		let infoWindows = [];

		// Create all the initial markers
		let markers = this.props.markersLocations
		  .filter(location => location.active)
		  .map((location) => {
			// Create each marker
			const marker = new window.google.maps.Marker({
				map: myMap,
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
				console.log('Open window set to FALSE')
			});
		
			infoWindows.push(markerInfowindow);
			
			bounds.extend(marker.position);
		  
			return marker;
		})
		
		this.setState({
			markers: markers
		});
	
		// Extend the boundaries of the map for each marker
		myMap.fitBounds(bounds);
		
		// Update map state
		this.updateMap(myMap);
		
		// Store in the App.js the map, all initial markers and infowindows
		this.props.getAllInitialMarkers(markers);
		this.props.getAllInitialInfowindows(infoWindows);
		this.props.getMap(myMap);
		
	}
	
	// Function to populate infoWindows
	populateInfoWindow = (marker, markerInfowindow) => {
		// Check if infowindow is not open from left side bar
		// All 'infowindow' in the initial locations array should be false
		// Get the id of the locations that is already open
		
		
		// Check that infowindow is not already opened on this marker => so open an infowindow
		if (markerInfowindow.marker !== marker) {
			
			// Change all marker icons to their default state
			this.state.markers.map(marker => marker.setIcon(this.defaultIcon))	
			
			markerInfowindow.marker = marker;
					
			// Set temporary infowindow content, until loading all the details
			const title = `<h4>${marker.title}</h4>`
			markerInfowindow.setContent(
				`<div>
					${title}
					<hr>
					Loading details...
				</div>`);
			
			// Get place ID from Foursquare using lat&long
			const placeLatLong=marker.position.lat()+','+marker.position.lng();

			/* 
			getFoursqPlaceId(placeLatLong)
			.then(data => data.response.venues[0].id)
			.then(id => {
				getVenueDetails(id)
					.then(r => r.json())
					.then(data => {
						console.log(data.response.venue);
						// Response from Foursquare is OK
						if (data.meta.code === 200) {
							markerInfowindow.setContent(
							`<div>
								${title}
								<hr>
								Success!
							</div>`);
// https://developers.google.com/maps/documentation/javascript/infowindows 
						} else {
							markerInfowindow.setContent(
							`<div>
								${title}
								<hr>
								<div className='error-display'>Sorry, but details for this place could not be loaded!</div>
							</div>`);
						}
					})
			})
			.catch( error => {
				markerInfowindow.setContent(
				`<div>
					${title}
					<hr>
					<div class='error-display'>Sorry, but there was an error while loading place details!</div>
				</div>`);
			}) */

			// DE STERS SI DE ACTIVAT CE E MAI SUS
			markerInfowindow.setContent(
				`<div>
					${title}
					<hr>
					<div class='error-display'>BRAVOSS! HAI CA POTI CRISTINA</div>
				</div>`)
				
			markerInfowindow.open(this.state.map, marker);

			// The marker is clicked, so change the icon
			marker.setIcon(this.changedIcon);
			
			// An infowindow has been opened
			this.setState({
				openWindow: true
			})
			console.log('Open window set to TRUE')
			
			// TODO: Set all infowindows to false?

		}
	}

	render = () => {
		const { markers, prevIdOpened } = this.state;
		const { markersLocations } = this.props;
		
		console.log('Sunt in MapContainer.js RENDER');
		
		let idToOpen;
		// Find the location that we should open the infowindow (true)
		let theLocation = markersLocations.filter(loc => loc.infowindow)[0];
		
		// Only if this location has at least 1 element, we can open the infowindow
		if (theLocation) {

			// Find the marker with this id and trigger click on it
			let theMarker  = markers.filter(mk => mk.id === theLocation.id)[0];
			
			if (theMarker) {
				idToOpen = theMarker.id;
				// Open the window only if the id changed
				if (prevIdOpened !== idToOpen) {
					window.google.maps.event.trigger(theMarker, 'click');
					this.updatePrevIdOpened(idToOpen);
				}
			}
		}
		
		let actualLocations = this.props.locationsToBeListed.length === 0 ? this.props.markersLocations : this.props.locationsToBeListed;
		
		return 	(
		<div id='map-content' role='application' aria-label='A map of Bucharest Old Town'>
		
		
			{
				false ? this.consola() : 5
			}

			
		
		</div>
		)
	}

}

export default MapContainer;