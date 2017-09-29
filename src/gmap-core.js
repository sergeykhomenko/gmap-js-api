class GMap {

    constructor(mapWrapper, points = [], initOptions = {}) {
        this.error_log = [];

        // Construction errors hadler
        if (!this.checkRequirements(...arguments)) {
            console.log(`Errors for map #${mapWrapper}`);

            for (let err of this.error_log)
                console.log(`Error: ${err}`);
            return false;
        }

        // Load Google Maps API
        if (!this.loadGmapsApi(mapWrapper)) {
            console.log(`API can not be loaded. Details: ${this.error_log[0]}`);
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

    loadGmapsApi(variable) {
        // If api is loaded
        if (document.getElementById('gmaps-api') !== null)
            return true;

        // Does not exist API key
        if (typeof google_maps_key == 'undefined') {
            this.error_log.push('API key is undefined');
            return false;
        }

        let api_script = document.createElement('script');
        api_script.id = 'gmaps-api';
        api_script.src = `https://maps.googleapis.com/maps/api/js?key=${google_maps_key}&callback=${variable}.init`;

        document.body.append(api_script);
    }

}