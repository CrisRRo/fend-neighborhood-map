
const CLIENT_ID ='ADPHXQOXKITAIA0ZJEY0H0GSXNKZRA4LK320EKNHKRXJFQYI'
const CLIENT_SECRET = '4OVJSDHY3A0ZQ4JE3UWSYKVLNF3NSDOTVONUVX1SIIM1CN2K'

export const getFoursqPlaceId = (placeLatLong) => 
	fetch('https://api.foursquare.com/v2/venues/search?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20180323&ll='+placeLatLong+'&limit=1')
	.then( response => response.json() )
	.then( data => data )

export const getVenueDetails = (placeId) => 
	fetch('https://api.foursquare.com/v2/venues/'+placeId+'?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20180323&limit=1')
	//.then( response => response.json() )
	//.then( data => data )

export const showPlaceDetails = (venue) => {
	let descr = '';
	
	// Place title
	descr += venue.name ? `<h4>${venue.name}</h4>` : '';
	descr += `<hr>`
	
	descr += `<div class="image-and-text">`
			
	// Place image - try to find at least 1 photo		
	let imageUrl;
	if (venue.bestPhoto.prefix && venue.bestPhoto.suffix) {
		imageUrl = venue.bestPhoto.prefix + '150x150' + venue.bestPhoto.suffix;
		console.log(imageUrl);
	} else if (venue.photos.groups[0].items[0].prefix &&  venue.photos.groups[0].items[0].suffix) {
		imageUrl = venue.photos.groups[0].items[0].prefix + '150x150' +  venue.photos.groups[0].items[0].suffix;
		console.log(imageUrl);
	}
	
	descr +=  imageUrl ? 
			`<img src="${imageUrl}" alt="Image of ${venue.name}" height="50px" width="auto">` : '';
	
	descr += `<div class="text-near-image">`
	
	// Place category if exists
	descr += venue.categories[0].name ? 
			`<div> 
				<strong>Category: </strong> ${venue.categories[0].name}
			</div>` : '';
	
	// Place rating
	descr +=  venue.rating ? 
			`<div> 
				<strong>Rating: </strong> ${venue.rating}
			</div>` : '';
	
	// Place opened now
	descr +=  venue.popular.status ? 
			`<div> 
				<strong>Opened now: </strong> ${venue.popular.status}
			</div>` : '';
	
	descr += `</div></div>`
	
	descr += `<hr>`
	
	// Place address if exists
	descr += venue.location.formattedAddress ? 
			`<div> 
				<strong>Address: </strong> ${venue.location.formattedAddress}
			</div>` : '';
	
	// Place website
	descr +=  venue.url ? 
			`<div> 
				<strong>Web: </strong> <a href="${venue.url}" target="_blank">${venue.url}</a>
			</div>` : '';
	
	// Place description
	descr +=  venue.description ? 
			`<div></div><div> 
				<strong>Description: </strong> ${venue.description}
			</div>` : '';
	
	// Thanks to Foursquare
	let fsqUrl = venue.canonicalUrl ? venue.canonicalUrl : 'https://developer.foursquare.com/';
	descr += `<hr><div class="thanks">A lot of thanks to <a href="${fsqUrl}" target="_blank">Foursquare</a> for this info.</div>`;
	
	return descr;
}
