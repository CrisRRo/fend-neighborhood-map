import React, { Component } from 'react'
import PropTypes from 'prop-types'

/* global google */

class MapContainer extends Component {
	

		
	render() {		
		return (
			<div id="map-container" ref="map" style={{height:500,width:500}}>
				I should be a map too
			</div>
		)
	}

}

export default MapContainer;