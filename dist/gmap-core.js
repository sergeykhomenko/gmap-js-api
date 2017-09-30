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
    }]);

    return GMap;
}();