import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LeftSideBar extends Component {
	static propTypes = {
		markersLocations: PropTypes.array.isRequired,
		handleMarkersLocations: PropTypes.func.isRequired
	}
	
	state = {
		query: '',
		id: ''
	}
	
	updateQuery = (prevUserInput) => {
		this.setState({
			query: prevUserInput.trim()
		})
	}
	
	updateId = (id) => {
		this.setState({
			id: id
		})
	}
	
	clearQuery = () => {
		this.setState({
			query: ''
		})
	}

	transferLocationId = (id) => {
		console.log(id);
		
		// The infowindow should be opened for this id =>
		// Update the infowindow state for this location 
		// in the initial locations array
		this.props.handleMarkersLocations(this.props.markersLocations, id)
	}

	componentWillMount = () => {
		console.log('LeftSideBar component WILL mount');
	}
	
	componentDidMount = () => {
		console.log('LeftSideBar component DID mount');
	}
	
	componentWillUnmount = () => {
		console.log('LeftSideBar component WILL UNMOUNT');
	}
	
	shouldComponentUpdate = () => {
		console.log('LeftSideBar component SHOULD UPDATE');
		return true;
	}
	
	componentDidUpdate = () => {
		console.log('LeftSideBar component DID UPDATE');
	}
	
	
	render = () => {
	  console.log('Sunt in LeftSideBar.js RENDER');
	  
	  const { markersLocations } = this.props;
	  const { query } = this.state;
	  
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
				{markersLocations
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