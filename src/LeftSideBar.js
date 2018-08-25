import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LeftSideBar extends Component {
	static propTypes = {
		markersLocations: PropTypes.array.isRequired,
		locationsToBeListed: PropTypes.array.isRequired,
		handleMarkersLocations: PropTypes.func.isRequired,
		transferQuery: PropTypes.func.isRequired
	}
	
	state = {
		query: ''
	}
	
	updateQuery = (prevUserInput) => {
		this.setState({
			query: prevUserInput.trim()
		})
		this.props.transferQuery(prevUserInput)
	}

	// The infowindow should be opened for this id =>
	// Update the infowindow state for this location 
	// in the initial locations array
	transferLocationId = (id) => {
		this.props.handleMarkersLocations(this.props.markersLocations, id)
	}

	render = () => {
	  const { markersLocations, locationsToBeListed } = this.props;
	  const { query } = this.state;
	  
	  // If locations are not filtered by user input, then list the initial locations
	  let actualLocations = locationsToBeListed.length === 0 ? markersLocations : locationsToBeListed;

	  return (
		<section id='left-side-bar' role='navigation'>
			<h3>Recommended places for one day</h3>
			
			<input
				className='search-places'
				type='text'
				placeholder='Search places'
				value={query}
				onChange={(event) => this.updateQuery(event.target.value)}
			/>
			
			<ul className='the-list' role='listbox'>
				{actualLocations
				  .filter(location => location.active)
				  .map(location => (
					<li key={location.id} className='marker-title' role='button' tabIndex='0' onClick={() => this.transferLocationId(location.id)} onKeyDown={(event) => event.keyCode === 13 && this.transferLocationId(location.id)}>
						{location.title}
					</li>	
				))}
			</ul>
		</section>
	  )
	}
}

export default LeftSideBar;