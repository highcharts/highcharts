Getting started with Highmaps
===

Highmaps is Highcharts for geo maps. Mainly [choropleth maps](https://en.wikipedia.org/wiki/Choropleth_map) where the color intensity relates to some value of a geographic area, but Highmaps also supports different features like lines (roads, rivers etc.) and points (cities, points of interest) and more. Highmaps comes in two flavors, either as a standalone JavaScript file, or as a plugin for Highcharts.

Load the required files
-----------------------

For basics, see [Highcharts installation](https://highcharts.com/docs/getting-started/installation). The framework requirements and installation is the same for Highmaps as for Highcharts. To load Highmaps as a standalone product (if you don't have a license for Highcharts), include this script tag:

    
    <script src="https://code.highcharts.com/maps/highmaps.js"></script>

If you already have Highcharts installed in the web page and want to run Highmaps as a plugin, include this script tag _after_ `highcharts.js`:

    
    <script src="https://code.highcharts.com/maps/modules/map.js"></script>

Load the map
------------

Highmaps loads its maps from [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON), an open standard for description of geographic features. Most GIS software supports this format as export from for instance Shapefile or KML export. Read more in the [API reference](https://api.highcharts.com/highmaps#Highcharts.geojson) and [see the live demo](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/maps/demo/geojson-multiple-types/).

There are three basic sources for your map:

1.  Use our [Map collection](https://code.highcharts.com/mapdata/). Read the [tutorial article](https://highcharts.com/docs/maps/map-collection) on the map collection to get started.
2.  Find an SVG map online and convert it using our (experimental) [online converter](https://highcharts.com/studies/map-from-svg.htm). 
3.  Create your own map from scratch using an SVG editor, then convert them online. Read our tutorial on [Custom maps for Highmaps](https://highcharts.com/docs/maps/custom-maps).

Initialize the map
------------------

Read more on initializing a chart in [Your first chart](https://highcharts.com/docs/getting-started/your-first-chart). If you're running Highmaps as a jQuery plugin, the map is constructed with "Map" as the first argument:

    
    $('#container').highcharts('Map', {  
       ...  
    });

Otherwise, use the `Highcharts.Map` constructor like this:

    
    var chart = new Highcharts.Map('container', {  
       ...  
    });

Or, to avoid the `new` keyword, use the `Highcharts.mapChart` constructor:

    
    Highcharts.mapChart('container', {  
       ...  
    });

Add and join data
-----------------

Once the empty map is in place, we're ready to add the data to the [series.data](https://api.highcharts.com/highmaps/series.map.data) option. For the joining to work, each data point must have some identifier that relates to the same identifier in the map data set. This or these identifiers are then specified in the [joinBy](https://api.highcharts.com/highmaps/plotOptions.series.joinBy) option. See detailed documentation and examples there.

Another way to join the data is to simply skip the mapData and set the [path](https://api.highcharts.com/highmaps/series.map.data.path) directly on the data point. This mixes the data and the structure and is not generally recommended, but it performs faster, and may be considered in situations where you have static data and a backed to perform the joining.
