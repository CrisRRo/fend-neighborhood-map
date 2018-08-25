import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFoursqPlaceId, getVenueDetails, showPlaceDetails } from './InfoWindow.js';
import pinkFlag2 from './icons/pinkFlag2.png'
import greenFlag2 from './icons/greenFlag2.png'

class MapContainer extends Component {
	
	static propTypes = {
		markersLocations: PropTypes.array.isRequired,
		locationsToBeListed: PropTypes.array.isRequired
	}
						
	state = {
        map: {},
        markers: [],
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
	
	componentDidUpdate(prevProps, prevState) {  
	  	// Open infowindow when user clicks on left bar
		this.openInfowindowFromLeftBar();
	}

	componentDidMount = () => {
		// Insert Google Map API script
		const script = document.createElement('script');
		
		script.src = 		'https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyDV-dtGMk8LBbgrxByBIlwmjgWOvzJ6rYM&v=3&callback=initMap&onerror=googleError';
		script.async = true;
		script.defer = true;
		
		// Give it a unique id, append to the body. If called more than once, the id already exist so no need to load it again
		script.id = 'mapId'
	
		// Handle errors on loading map
		script.onerror = (event) => {
				document.getElementById('map-container').innerHTML = `<div class="map-error">Sorry, but there was an error while loading the map!</div>`;
		}
		
		document.getElementById('map-container').appendChild(script);

		window.initMap = this.initMap;
		window.gm_authFailure = this.gm_authFailure;
	}
	
	gm_authFailure = () => {
			document.getElementById('map-container').innerHTML = `<div class="map-error">Sorry, but the map could not be loaded due to authentication issues!</div>`;
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
		
		// Instantiate infoWindow
		const markerInfowindow = new window.google.maps.InfoWindow({
			maxWidth: 150
		});
		
		// Instantiate bounds for our markers
		const bounds = new window.google.maps.LatLngBounds();

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
			});

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
	}
	
	// Function to populate infoWindows
	populateInfoWindow = (marker, markerInfowindow) => {

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

			getFoursqPlaceId(placeLatLong)
			.then(data => data.response.venues[0].id)
			.then(id => {
				getVenueDetails(id)
					.then(r => r.json())
					.then(data => {
						// Response from Foursquare is OK
						if (data.meta.code === 200) {
							markerInfowindow.setContent(
							`<div class="infowindow">
								${showPlaceDetails(data.response.venue)}
							</div>`);
							
							/* 
							* Calculate the position of the infowindow so it can be completly seen 
							* A lot of thanks for solution to
							* https://stackoverflow.com/questions/35347715/positioning-infowindow-on-google-map
							*/
							const prevPosition = JSON.parse(JSON.stringify(markerInfowindow.getPosition()));
							const boundaries = JSON.parse(JSON.stringify(this.state.map.getBounds()));
							const newPosition = {lat: prevPosition.lat + Math.abs(boundaries.north - prevPosition.lat) / 2.75, lng: prevPosition.lng};
							markerInfowindow.setPosition(newPosition);
							
						} else {
							markerInfowindow.setContent(
							`<div>
								${title}
								<hr>
								<div class='error-display'>Sorry, but details for this place could not be loaded!</div>
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
			})
	
			markerInfowindow.open(this.state.map, marker);

			// The marker is clicked, so change the icon
			marker.setIcon(this.changedIcon);
			
			// An infowindow has been opened
			this.setState({
				openWindow: true
			})
		}
	}
	
	// Open infowindow when user clicks on left bar
	openInfowindowFromLeftBar = () => {
		const { markers, prevIdOpened } = this.state;
		const { markersLocations } = this.props;
		// Find the location that we should open the infowindow (infowidnow is true)
		let theLocation = markersLocations.filter(loc => loc.infowindow)[0];
		
		// Only if this location has at least 1 element, we can open the infowindow
		if (theLocation) {

			// Find the marker with this id and trigger click on it
			let theMarker  = markers.filter(mk => mk.id === theLocation.id)[0];
			
			if (theMarker) {
				let idToOpen = theMarker.id;
				// Open the window only if the id changed
				if (prevIdOpened !== idToOpen) {
					window.google.maps.event.trigger(theMarker, 'click');
					this.updatePrevIdOpened(idToOpen);
				}
			}
		}
	}
	
	render = () => {
		const { markers } = this.state;
		
		/* Hide markers that should not appera on the map */
		const { locationsToBeListed } = this.props;
		
		// First hide all markers and find the markers that should appear on the map
		let markersToBeShown = markers.filter(mk => {
            mk.setMap(null);
            return locationsToBeListed.some(loc => loc.id === mk.id)
        })
		
		// If noMatch
		if (locationsToBeListed[0] === "noMatch") {
			markersToBeShown = []
		} else if (markersToBeShown.length === 0 ) {
			// If user did not input anything, show all the markers
			markersToBeShown = markers
		}
		
		// If the map is initialized (state object not empty), show the markers on the map 
		if (!(Object.keys(this.state.map).length === 0 && this.state.map.constructor === Object)) {
			markersToBeShown.forEach( mk => {
				mk.setMap(this.state.map);
			})
		}
		
		return 	(
			<div id='map-content' role='application' aria-label='A map of Bucharest Old Town'></div>
		)
	}

}

export default MapContainer;