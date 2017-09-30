'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GMapCustomer = false;

var GMap = function () {
    function GMap(mapWrapper) {
        var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var initOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, GMap);

        this.error_log = [];

        this.defaults = {
            map_id: 'gmap-container',
            wrong_way: { lat: 49.9916, lng: 36.2319 },
            default_point: 0,
            zoom: 17,
            switch_class: 'gmap-reroute'
        };

        // Construction errors hadler
        if (!this.checkRequirements.apply(this, arguments)) {
            console.log('Errors for map #' + mapWrapper);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.error_log[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var err = _step.value;

                    console.log('Error: ' + err);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

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
        if (!this.loadAPIscript(mapWrapper)) return false;

        // Show UI
        this.addJQuerySwitches();
    }

    _createClass(GMap, [{
        key: 'checkRequirements',
        value: function checkRequirements(mapWrapper) {
            var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var initOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var complete = true;

            if (document.getElementById(mapWrapper) === null) {
                complete = false;
                this.error_log.push('You have no element with id ' + mapWrapper + ' on the page.');
            }

            if (!points.length) {
                complete = false;
                this.error_log.push('Your points array is empty');
            }

            return complete;
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            var optionsObject = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!optionsObject) return this.defaults;

            var options = {
                map_id: optionsObject.map_id || this.defaults.map_id,
                wrong_way: optionsObject.wrong_way || this.defaults.wrong_way,
                default_point: optionsObject.default_point || this.defaults.default_point,
                zoom: optionsObject.zoom || this.defaults.zoom,
                switch_class: optionsObject.switch_class || this.defaults.switch_class
            };

            if (typeof optionsObject.show_marker !== 'undefined') this.marker = optionsObject.show_marker;

            return options;
        }
    }, {
        key: 'loadAPIscript',
        value: function loadAPIscript(variable) {
            if (typeof google_maps_key == 'undefined') {
                console.log('Error: Undefined Google Maps API key');
                return false;
            }

            var apiBaseUrl = 'https://maps.googleapis.com/maps/api/js?';
            var apiUrl = apiBaseUrl + 'key=' + google_maps_key + '&callback=' + variable + '.renderMap';

            var apiScript = document.createElement('script');
            apiScript.src = apiUrl;

            this.prerender(variable);

            document.getElementById(variable).append(apiScript);
            return true;
        }
    }, {
        key: 'prerender',
        value: function prerender(wrapper) {
            var mapWrap = document.createElement('div');
            mapWrap.id = this.options.map_id;

            document.getElementById(wrapper).append(mapWrap);
        }

        // Google Maps Actions

    }, {
        key: 'renderMap',
        value: function renderMap() {

            this.map = new google.maps.Map(document.getElementById(this.options.map_id), {
                center: this.points[this.options.default_point].pos,
                zoom: this.options.zoom,
                scrollwheel: false
            });

            this.directions = new google.maps.DirectionsRenderer();
            this.directions.setMap(this.map);

            if (this.marker) {
                this.marker = new google.maps.InfoWindow({
                    map: this.map,
                    position: this.points[this.options.default_point].pos,
                    content: this.points[this.options.default_point].name
                });
            }

            var userLocation = navigator.geolocation;
            var self = this;

            if (userLocation) {
                userLocation.getCurrentPosition(function (customerPosition) {
                    // you can't use ```this``` here. ```this``` equals ```true```
                    var customer = {
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
    }, {
        key: 'locationError',
        value: function locationError() {
            this.route(this.options.wrong_way, this.points[this.options.default_point]);
        }
    }, {
        key: 'route',
        value: function route(customerPosition) {
            var destionationPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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
    }, {
        key: 'routeCallback',
        value: function routeCallback(response, status) {
            if (status === 'OK') {
                map.directions.setDirections(response);
            }
        }
    }, {
        key: 'rerouter',
        value: function rerouter(points_iterator) {
            // Check for point count
            if (points_iterator >= this.points.length) {
                console.log('point[\'' + points_iterator + '\'] does n\'t exist');
                return false;
            }

            this.route(GMapCustomer, this.points[points_iterator]);
        }

        // UI

    }, {
        key: 'addJQuerySwitches',
        value: function addJQuerySwitches() {
            // add buttons
            for (var i = 0; i < this.points.length; i++) {
                var switchButton = document.createElement('button');
                switchButton.className = this.options.switch_class;
                switchButton.innerHTML = this.points[i].name;
                switchButton.dataset.point = i;

                document.getElementById(this.options.map_id).after(switchButton);
            }

            var $ = jQuery;
            var self = this;
            $('.' + self.options.switch_class).on('click', function () {
                self.rerouter(+$(this).data('point'));
            });
        }
    }]);

    return GMap;
}();