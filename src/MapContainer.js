import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MapContainer extends Component {
	
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
		const map = new window.google.maps.Map(document.getElementById('map-content'), {
			center: {lat: 44.431474, lng: 26.100319},
			zoom: 15
		});		
	}

	render() {		
		return (
			<div id='map-content' role='application' aria-label='A map of Bucharest Old Town'></div>
		)
	}

}

export default MapContainer;