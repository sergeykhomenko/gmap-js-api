var gmap_options = {
	points: [
		{
			name: 'Отдел продаж',
			pos: { lat: 50.0117, lng: 36.309 }
		},
		{
			name: 'Жилой комплекс',
			pos: { lat: 50.019, lng: 36.2 }
		}
	],
	default_point: 1,
	zoom: 17,

	directions: false,
	map: false,
	marker: false,

	customer: false
};

function gmap_init () {
	var map_wrapper = document.getElementById('yandex-map');
	gmap_options.map = new google.maps.Map(
		map_wrapper,
		{
			center: gmap_options.points[0].pos,
			zoom: gmap_options.zoom
		}
	);

	gmap_options.directions = new google.maps.DirectionsRenderer();
	gmap_options.directions.setMap( gmap_options.map );

	gmap_options.marker = new google.maps.InfoWindow( {
		map: gmap_options.map,
		position: gmap_options.points[gmap_options.default_point].pos,
		content: gmap_options.points[gmap_options.default_point].name
	} );
	var locationObj = navigator.geolocation;

	if( locationObj ) {
		locationObj.getCurrentPosition( function ( position ) {
			var customer_position = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			gmap_route( customer_position, gmap_options.points[gmap_options.default_point] );
		}, function () {
			gmap_location_error();
		} );
	} else {
		gmap_location_error();
	}

}

function gmap_location_error() {

	gmap_route ( {
		lat: 49.9916,
		lng: 36.2319
	} );

}

function gmap_route( customer_position, destination_point ){
	if( ! gmap_options.customer ){
		gmap_options.customer = customer_position;
	}

	var direction_service = new google.maps.DirectionsService();
	var direction_request = {
		origin: customer_position,
		destination: destination_point.pos,
		travelMode: google.maps.TravelMode.WALKING
	};

	direction_service.route( direction_request, gmap_route_callback );
	gmap_options.marker.setContent( destination_point.name );
	gmap_options.marker.setPosition( destination_point.pos );
}

function gmap_route_callback ( response, status ) {
	if( status === 'OK' ){
		gmap_options.directions.setDirections( response );
	}
}

function gmap_rerouter ( points_iterator ) {
	gmap_route( gmap_options.customer, gmap_options.points[points_iterator] );
}

$(".gmap-reroute").on( 'click', function () {
	gmap_rerouter( +$(this).data('point') );
} );
