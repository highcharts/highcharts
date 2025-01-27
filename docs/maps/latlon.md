Latitude/longitude
===

Note: The following content is only relevant to legacy versions of Highcharts. Since Highcharts v9.3, experimental projection is built in, allowing the use of `lat` and `lon` properties to be handled without the use of proj4js, as well as applying GeoJSON-compliant [geometry](https://api.highcharts.com/highmaps/series.data.geometry) configuration to points, maplines and map points directly.

<iframe style="width: 100%; height: 550px; border: 0;" src="https://www.highcharts.com/samples/embed/maps/demo/latlon-advanced" allow="fullscreen"></iframe>

Highcharts Maps from version 1.1.0 comes with support for latitude/longitude. This feature requires that the [proj4js](http://proj4js.org) library has been loaded before Highcharts Maps. The latest version of the _proj4js_ library can be loaded from [cdnjs](https://cdnjs.com/libraries/proj4js).

    <!-- Example of loading from CDNJS: -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.6/proj4.js"></script>

With this feature you can specify the coordinates of map points and bubbles using latitude/longitude directly:


    series: [{
    	type: 'mappoint',
    	name: 'Cities',
    	data: [{
    	    name: 'London',
    	    lat: 51.507222,
    	    lon: -0.1275
    	}, {
    	    name: 'Birmingham',
    	    lat: 52.483056,
    	    lon: -1.893611
    	}, {
    	    name: 'Leeds',
    	    lat: 53.799722,
    	    lon: -1.549167
    	}]
    }]

You can also use the [Chart.fromLatLonToPoint](https://api.highcharts.com/class-reference/Highcharts.Chart#fromLatLonToPoint) and [Chart.fromPointToLatLon](https://api.highcharts.com/class-reference/Highcharts.Chart#fromPointToLatLon) functions to convert between map values and latitude/longitude manually.

Add lat/lon support to custom maps
----------------------------------

For custom maps to support latitude/longitude they must have a `hc-transform` object defined on them in the following format:


    "hc-transform": {
    	"default": {
    		"crs": "Your map projection in proj4 string format, as supported by pro4js"
    	}
    }

This object contains information necessary to transform the coordinates used in the map to latitude/longitude, and vice versa. Adding this information to your map is easily done with a text editor, assuming your map is stored in [GeoJSON](https://highcharts.com/docs/maps/custom-geojson-maps) format.

It is possible to expand on the definition above for more complex maps. The following is an example where the map is split into multiple zones, where each zone has its own transform object. This is useful if you have combined multiple maps together, as is often seen with overseas areas:


    "hc-transform": {
    	"default": {
    		"crs": "+proj=lcc +lat_1=33 +lat_2=45 +lat_0=39 +lon_0=-96 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs"
    	},
    	"zone2": {
    		"crs": "+proj=aea +lat_1=8 +lat_2=18 +lat_0=13 +lon_0=-157 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs",
    		"hitZone": {
    			"type": "Polygon",
    			"coordinates": [[[1747,3900],[3651,2950],[3651,-999],[1747,-999],[1747,3900]]]
    		},
    		"xpan": 190,
    		"ypan": 417,
    		"scale": 0.000123090941806
    	},
    	"zone3": {
    		"crs": "+proj=tmerc +lat_0=54 +lon_0=-142 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
    		"hitZone": {
    			"type": "Polygon",
    			"coordinates": [[[-999,5188],[-707,5188],[1747,3900],[1747,-999],[-999,-999],[-999,5188]]]
    		},
    		"xpan": 5,
    		"ypan": 357,
    		"scale": 5.84397059179e-05,
    		"rotation": 0.2618
    	}
    }

The `hitZone` property is a GeoJSON geometry object, specifying the extent of the zone in the map. The `scale` property specifies a scaling factor applied to the projected coordinates. The `xpan` and `ypan` properties specify offsets applied to the projected coordinates after scaling. Using these parameters it is possible to move and resize areas in the projected map coordinate system while retaining lat/lon support. The `rotation` property specifies the clockwise rotation of the coordinates before scaling and panning, in radians. The rotation is relative to the coordinate system origin.

Highcharts Maps will automatically detect which transform object to use when transforming to and from lat/lon on a map. If you want to manually perform a conversion using a specific transform object, use the [Chart.transformToLatLon](https://api.highcharts.com/class-reference/Highcharts.Chart#transformToLatLon) and [Chart.transformFromLatLon](https://api.highcharts.com/class-reference/Highcharts.Chart#transformFromLatLon) functions.
