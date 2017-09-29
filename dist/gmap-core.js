'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GMap = function () {
    function GMap(mapWrapper) {
        var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var initOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        _classCallCheck(this, GMap);

        this.error_log = [];

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
            api_script.src = 'https://maps.googleapis.com/maps/api/js?key=' + google_maps_key + '&callback=' + variable + '.init';

            document.body.append(api_script);
        }
    }]);

    return GMap;
}();