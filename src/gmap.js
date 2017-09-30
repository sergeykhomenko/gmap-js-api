var GMapCustomer = false;

class GMap {

    constructor(mapWrapper, points = [], initOptions = {}) {

        this.error_log = [];

        this.defaults = {
            map_id: 'gmap-container',
            wrong_way: { lat: 49.9916, lng: 36.2319 },
            default_point: 0,
            zoom: 17,
            switch_class: 'gmap-reroute'
        };

        // Construction errors hadler
        if (!this.checkRequirements(...arguments)) {
            console.log(`Errors for map #${mapWrapper}`);

            for (let err of this.error_log)
                console.log(`Error: ${err}`);
            return false;
        }

        // Prepare options
        this.options = this.getOptions(initOptions);

        this.map = false;
        this.directions = false;
        this.marker = true;

        this.points = points;

        var self = this;

        // Load API
        if (!this.loadAPIscript(mapWrapper))
            return false;

        // Show UI
        this.addJQuerySwitches();
    }

    checkRequirements(mapWrapper, points = [], initOptions = {}) {
        let complete = true;

        if (document.getElementById(mapWrapper) === null) {
            complete = false;
            this.error_log.push(`You have no element with id ${mapWrapper} on the page.`);
        }

        if (!points.length) {
            complete = false;
            this.error_log.push(`Your points array is empty`);
        }

        return complete;
    }

    getOptions(optionsObject = false) {
        if (!optionsObject)
            return this.defaults;

        let options = {
            map_id: optionsObject.map_id || this.defaults.map_id,
            wrong_way: optionsObject.wrong_way || this.defaults.wrong_way,
            default_point: optionsObject.default_point || this.defaults.default_point,
            zoom: optionsObject.zoom || this.defaults.zoom,
            switch_class: optionsObject.switch_class || this.defaults.switch_class
        };

        if (typeof optionsObject.show_marker !== 'undefined')
            this.marker = optionsObject.show_marker;

        return options;
    }

    loadAPIscript(variable) {
        if (typeof google_maps_key == 'undefined') {
            console.log('Error: Undefined Google Maps API key');
            return false;
        }

        let apiBaseUrl = 'https://maps.googleapis.com/maps/api/js?';
        let apiUrl = `${apiBaseUrl}key=${google_maps_key}&callback=${variable}.renderMap`;

        let apiScript = document.createElement('script');
        apiScript.src = apiUrl;

        this.prerender(variable);

        document.getElementById(variable).append(apiScript);
        return true;
    }

    prerender(wrapper) {
        let mapWrap = document.createElement('div');
        mapWrap.id = this.options.map_id;

        document.getElementById(wrapper).append(mapWrap);
    }

    // Google Maps Actions
    renderMap() {

        this.map = new google.maps.Map(
            document.getElementById(this.options.map_id),
            {
                center: this.points[this.options.default_point].pos,
                zoom: this.options.zoom,
                scrollwheel: false
            }
        );

        this.directions = new google.maps.DirectionsRenderer();
        this.directions.setMap(this.map);

        if (this.marker) {
            this.marker = new google.maps.InfoWindow({
                map: this.map,
                position: this.points[this.options.default_point].pos,
                content: this.points[this.options.default_point].name
            });
        }

        let userLocation = navigator.geolocation;
        let self = this;

        if (userLocation) {
            userLocation.getCurrentPosition(function (customerPosition) {
                // you can't use ```this``` here. ```this``` equals ```true```
                let customer = {
                    lat: customerPosition.coords.latitude,
                    lng: customerPosition.coords.longitude
                };

                self.route(customer, self.points[self.options.default_point]);
            }, function () {
                self.locationError();
            });
        } else {
            self.locationError();
        }
    }

    locationError() {
        this.route(this.options.wrong_way, this.points[this.options.default_point]);
    }

    route(customerPosition, destionationPoint = false) {
        if (!destionationPoint) {
            console.log('Error: unable route to undefined destination point');
            return false;
        }

        if (!GMapCustomer) {
            GMapCustomer = customerPosition;
        }

        var directionService = new google.maps.DirectionsService();
        var directionRequest = {
            origin: customerPosition,
            destination: destionationPoint.pos,
            travelMode: google.maps.TravelMode.WALKING
        };

        directionService.route(directionRequest, this.routeCallback);

        if (this.marker) {
            this.marker.setPosition(destionationPoint.pos);
            this.marker.setContent(destionationPoint.name);
        }
    }

    routeCallback(response, status) {
        if (status === 'OK') {
            map.directions.setDirections(response);
        }
    }

    rerouter(points_iterator) {
        // Check for point count
        if (points_iterator >= this.points.length) {
            console.log('point[\'' + points_iterator + '\'] does n\'t exist');
            return false;
        }

        this.route(GMapCustomer, this.points[points_iterator]);
    }

    // UI
    addJQuerySwitches () {
		// add buttons
		for( let i = 0; i < this.points.length; i++) {
			let switchButton = document.createElement('button');
			switchButton.className = this.options.switch_class;
			switchButton.innerHTML = this.points[i].name;
			switchButton.dataset.point = i;

			document.getElementById(this.options.map_id).after(switchButton);
		}

        let $ = jQuery;
        let self = this;
		$( '.' + self.options.switch_class ).on( 'click', function () {
			self.rerouter( +$(this).data('point') );
		} );
	}

}