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
        this.map_wrapper = mapWrapper;

        // Construction errors hadler
        if (!this.checkRequirements(...arguments)) {
            console.log(`Errors for map #${mapWrapper}`);

            for (let err of this.error_log)
                console.log(`Error: ${err}`);
            return false;
        }

        // GMap properties
        this.options = this.loadOptions(initOptions);

        this.map = false;
        this.points = points;
        this.directions = false;
        this.marker = false;
        this.customer = false;

        // Load Google Maps API
        if (!this.loadGmapsApi(mapWrapper)) {
            console.log(`API can not be loaded. Details: ${this.error_log[0]}`);
            return false;
        }

        // Add buttons
        if (typeof jQuery !== 'undefined') {
            this.addJQuerySwitches();
        }
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

    loadOptions(opt_object) {
        let show_marker_option = true;

        if (typeof opt_object.show_marker !== 'undefined')
            show_marker_option = opt_object.show_marker;

        return {
            map_id: opt_object.map_id || this.defaults.map_id,
            wrong_way: opt_object.wrong_way || this.defaults.wrong_way,
            default_point: opt_object.default_point || this.defaults.default_point,
            zoom: opt_object.zoom || this.defaults.zoom,
            switch_class: opt_object.switch_class || this.defaults.switch_class,
            show_marker: show_marker_option
        };
    }

    loadGmapsApi(variable) {
        // If api is loaded
        if (document.getElementById('gmaps-api') !== null) {
            return true;
        }

        // Does not exist API key
        if (typeof google_maps_key == 'undefined') {
            this.error_log.push('API key is undefined');
            return false;
        }

        let api_script = document.createElement('script');
        api_script.id = 'gmaps-api';
        api_script.src = `https://maps.googleapis.com/maps/api/js?key=${google_maps_key}&callback=${variable}.renderMap`;

        document.body.append(api_script);
        return true;
    }

    renderMap() {
        let map_element = document.createElement('div');
        map_element.id = this.options.map_id;
        document.getElementById(this.map_wrapper).append(map_element);

        let map_wrapper = document.getElementById(this.options.map_id);
        this.map = new google.maps.Map(
            map_wrapper,
            {
                center: this.points[this.options.default_point].pos,
                zoom: this.options.zoom,
                scrollwheel: false
            }
        );

        this.directions = new google.maps.DirectionsRenderer({
            preserveViewport: true // no zoom when render, helps on mobile
        });

        if (this.options.show_marker) {
            this.marker = new google.maps.InfoWindow({
                map: this.map,
                position: this.points[this.options.default_point].pos,
                content: this.points[this.options.default_point].name
            });
        }

        // HTML5 geolocation
        let location = navigator.geolocation;
        let customer;
        if (location) {
            location.getCurrentPosition(function (position) {
                customer = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            }, function () {
                customer = this.locationError();
            });
        } else {
            customer = this.locationError();
        }

        this.route(customer, this.points[this.options.default_point]);

    }

    locationError() {
        return this.options.wrong_way;
    }

    route(customer_position, destination_point) {
        let direction_service = new google.maps.DirectionsService();
        let direction_request = {
            origin: customer_position,
            destination: destination_point.pos,
            travelMode: google.maps.TravelMode.WALKING
        };

        direction_service.route(direction_request, this.routeCallback);
        if (this.marker) {
            this.marker.setContent(destination_point.name);
            this.marker.setPosition(destination_point.pos);
        }

        console.log(customer_position);
        this.map.setCenter({ lat: customer_position.lat, lng: customer_position.lng });
    }

    routeCallback(response, status) {
        if (status === 'OK') {
            this.directions.setMap(this.map)
            this.directions.setDirections(response);
        }
    }

    rerouter(points_iterator) {

    }

    addJQuerySwitches() {

    }

}