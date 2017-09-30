# Google Maps API plugin
TODO: finish "Plugin Options"

## Requirements
 - jQuery

For building lib from the sources use ```npm run build```

## How to use
You can call map render using next way:

    <div id="map"></div>
    <script src="../dist/gmap-core.js"></script>
    <script>
        var google_maps_key = ' << YOUR GOOGLE MAPS API KEY >>';
        var map = new GMap('map', [{name: 'Home', pos: { lat: ..., lng: ... }}], << INIT OPTIONS >> );
    </script>

For all available init options look to "Plugin Options" section

## Plugin options
...

## Multiple maps
This plugin doesn't support multiple maps. Maybe i will fix it later, but not now.

Need to found the way to call ```new google....``` not from API callback