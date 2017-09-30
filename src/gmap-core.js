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

}