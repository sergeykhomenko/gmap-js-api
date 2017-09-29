function GMap( mapWrapper, points, initOptions = {} ){

	var self = this;

	self.defaults = {
		map_id: 'gmap-container',
		wrong_way: { lat: 49.9916, lng: 36.2319 },
		zoom: 17,
		default_point: 0,
		switch_class: 'gmap-reroute'
	};

	self.options    = initOptions;

	self.points     = points;
	self.directions = false;
	self.map        = false;
	self.marker     = false;
	self.customer   = false;

	this.pluginInit = function ( wrapper ) {
		var mapElement = document.createElement('div');
		mapElement.id = self.options.map_id || self.defaults.map_id;

		var mapAPI = document.createElement('script');
		mapAPI.src = 'https://maps.googleapis.com/maps/api/js?key=' + google_maps_key;
		//  + '&callback=' + mapWrapper + '.init'
		console.log('https://maps.googleapis.com/maps/api/js?key=' + google_maps_key);

		document.getElementById(mapWrapper).append(mapElement);
		document.getElementById(mapWrapper).append(mapAPI);

		if( self.options.default_point === undefined ){
			self.options.default_point = self.defaults.default_point;
		}
	}

	this.init = function () {
		var map_wrapper = document.getElementById( self.options.map_id || self.defaults.map_id );
		self.map = new google.maps.Map(
			map_wrapper,
			{
				center: self.points[0].pos,
				zoom: self.options.zoom || self.defaults.zoom,
				scrollwheel: false
			}
		);

		self.directions = new google.maps.DirectionsRenderer( {
			preserveViewport: true // no zoom when render
		} );
		self.directions.setMap( self.map );

		self.marker = new google.maps.InfoWindow( {
			map: self.map,
			position: self.points[self.options.default_point].pos,
			content: self.points[self.options.default_point].name
		} );
		var locationObj = navigator.geolocation;

		if( locationObj ) {
			locationObj.getCurrentPosition( function ( position ) {
				var customer_position = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				self.route( customer_position, self.points[self.options.default_point] );
			}, function () {
				self.locationError();
			} );
		} else {
			self.locationError();
		}
	}

	this.route = function ( customer_position, destination_point ) {
		if( ! self.customer ){
			self.customer = customer_position;
		}

		var direction_service = new google.maps.DirectionsService();
		var direction_request = {
			origin: customer_position,
			destination: destination_point.pos,
			travelMode: google.maps.TravelMode.WALKING
		};

		direction_service.route( direction_request, self.routeCallback );
		if( self.options.show_marker === undefined || self.options.show_marker ){
			self.marker.setContent( destination_point.name );
			self.marker.setPosition( destination_point.pos );
		}

		self.map.setCenter( customer_position );
	}

	this.locationError = function() {
		self.route( (self.options.wrong_way || self.defaults.wrong_way), self.points[self.options.default_point] );
	}

	this.routeCallback = function( response, status ) {
		if( status === 'OK' ){
			self.directions.setDirections( response );
		}
	}

	this.rerouter = function( points_iterator ) {
		// Check for point count
		if ( points_iterator >= self.points.length ) {
			console.log('point[\'' + points_iterator + '\'] does n\'t exist');
			return false;
		}

		self.route( self.customer, self.points[points_iterator] );
	}

	this.addJQuerySwitches = function () {
		// add buttons
		for( var i = 0; i < self.points.length; i++) {
			var switchButton = document.createElement('button');
			switchButton.className = self.options.switch_class || self.defaults.switch_class;
			switchButton.innerHTML = self.points[i].name;
			switchButton.dataset.point = i;

			document.getElementById(mapWrapper).append(switchButton);
		}

		var $ = jQuery;
		$( '.' + (self.options.switch_class || self.defaults.switch_class) ).on( 'click', function () {
			self.rerouter( +$(this).data('point') );
		} );
	}

	// Pluign initial
	this.pluginInit();

	// Add buttons
	if( jQuery !== undefined ) {
		self.addJQuerySwitches();
	}
}
