
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
