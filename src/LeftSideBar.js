import React, { Component } from 'react'
import PropTypes from 'prop-types'

class LeftSideBar extends Component {
	static propTypes = {
		markers: PropTypes.array.isRequired
	}
	
	render() {
		const markers = this.props.markers;
		
		return (
		<section id='left-side-bar' role='navigation'>
			<h3>Recommended places for one day</h3>
				
			{console.log(markers)}
				
			<ul className='the-list' role='listbox'>
				{markers.map(marker => (
					<li key={marker.position} className='marker-title' role='button' tabIndex='0'>
						{marker.title}
						{console.log(marker.title)}
					</li>
				))}
			</ul>
		</section>
		)
	}
}

export default LeftSideBar;