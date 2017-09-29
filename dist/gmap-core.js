'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.map_wrapper = mapWrapper;

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

        // Load Google Maps API
        if (!this.loadGmapsApi(mapWrapper)) {
            console.log('API can not be loaded. Details: ' + this.error_log[0]);
            return false;
        }

        // GMap properties
        this.options = this.loadOptions(initOptions);

        this.map = false;
        this.points = points;
        this.directions = false;
        this.marker = false;
        this.customer = false;
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
        key: 'loadOptions',
        value: function loadOptions(opt_object) {
            return {
                map_id: opt_object.map_id || this.defaults.map_id,
                wrong_way: opt_object.wrong_way || this.defaults.wrong_way,
                default_point: opt_object.default_point || this.defaults.default_point,
                zoom: opt_object.zoom || this.defaults.zoom,
                switch_class: opt_object.switch_class || this.defaults.switch_class
            };
        }
    }, {
        key: 'loadGmapsApi',
        value: function loadGmapsApi(variable) {
            // If api is loaded
            if (document.getElementById('gmaps-api') !== null) return true;

            // Does not exist API key
            if (typeof google_maps_key == 'undefined') {
                this.error_log.push('API key is undefined');
                return false;
            }

            var api_script = document.createElement('script');
            api_script.id = 'gmaps-api';
            api_script.src = 'https://maps.googleapis.com/maps/api/js?key=' + google_maps_key + '&callback=' + variable + '.renderMap';

            document.body.append(api_script);
            return true;
        }
    }, {
        key: 'renderMap',
        value: function renderMap() {
            var map_element = document.createElement('div');
            map_element.id = this.options.map_id;
            document.getElementById(this.map_wrapper).append(map_element);

            var map_wrapper = document.getElementById(this.options.map_id);
            this.map = new google.maps.Map(map_wrapper, {
                center: this.points[this.options.default_point].pos,
                zoom: this.options.zoom,
                scrollwheel: false
            });
        }
    }]);

    return GMap;
}();