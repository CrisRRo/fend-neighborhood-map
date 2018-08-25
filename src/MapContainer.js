import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getFoursqPlaceId, getVenueDetails } from './InfoWindow.js';
import pinkFlag2 from './icons/pinkFlag2.png'
import greenFlag2 from './icons/greenFlag2.png'

class MapContainer extends Component {
	
	static propTypes = {
		markersLocations: PropTypes.array.isRequired,
		locationsToBeListed: PropTypes.array.isRequired
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
	
	componentDidUpdate(prevProps, prevState) {
	  // only update if the data has changed
	  if (prevState.prevIdOpened !== this.state.prevIdOpened) {
		console.log('Previous ID opened: ' + prevState.prevIdOpened);
		console.log('Actual ID opened' + this.state.prevIdOpened);
	  }
	}

	// Insert Google Map API script
	componentDidMount = () => {
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

						console.log(data.response.venue);
						// Response from Foursquare is OK
						if (data.meta.code === 200) {
							markerInfowindow.setContent(
							`<div>
								${title}
								<hr>
								Success!
								${this.showPlaceDetails(data.response.venue)}
								
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
			}) 

			// DE STERS SI DE ACTIVAT CE E MAI SUS
			/*markerInfowindow.setContent(
				`<div>
					${title}
					<hr>
					<div class='error-display'>BRAVOSS! HAI CA POTI CRISTINA</div>
				</div>`)*/
				
			markerInfowindow.open(this.state.map, marker);

			// The marker is clicked, so change the icon
			marker.setIcon(this.changedIcon);
			
			// An infowindow has been opened
			this.setState({
				openWindow: true
			})
		}
	}
	
	showPlaceDetails = (venue) => {
		
		let descr = '';
		descr += `<div> 
						Category: ${venue.categories[0].shortName}
					</div>`
		return descr;
	}
	

	render = () => {
		const { markers, prevIdOpened } = this.state;
		const { markersLocations } = this.props;
		
		console.log('Sunt in MapContainer.js RENDER');
		
					/* - - - - - - - */
		/* Open infowindow when user click on left bar */

		// Find the location that we should open the infowindow (true)
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
		
					/* - - - - - - - */
		/* Hide markers that should not appera on the map */
		const { locationsToBeListed } = this.props;
		
		// First hide all markers and find the markers that should appear on the map
		console.log('Markerii nostrii')
		console.log(markers)
		let markersToBeShown = markers.filter(mk => {
            mk.setMap(null);
            return locationsToBeListed.some(loc => loc.id === mk.id)
        })
		
		console.log('Locations to be listes')
		console.log(locationsToBeListed)
		console.log('Markers to be shown')
		console.log(markersToBeShown)
		
		console.log(typeof locationsToBeListed[0])
		// If noMatch
		if (locationsToBeListed[0] === "noMatch") {
			console.log('Avem noMatch')
			markersToBeShown = []
		} else if (markersToBeShown.length === 0 ) {
			// If user did not input anything, show all the markers
			markersToBeShown = markers
		}
		
		console.log('Markers to be shown')
		console.log(markersToBeShown)
		
		console.log('Harta noastra in starea ei')
		console.log(this.state.map)
		
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